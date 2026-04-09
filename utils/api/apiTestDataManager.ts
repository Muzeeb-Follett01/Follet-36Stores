/**
 * API Test Data Manager
 * Handles test data generation, management and validation for API tests
 */

import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

export interface TestDataTemplate {
  name: string;
  description?: string;
  data: Record<string, any>;
  validators?: Record<string, (value: any) => boolean | string>;
}

export interface DataGeneration {
  field: string;
  type: 'faker' | 'static' | 'pattern' | 'function';
  value?: any;
  fakerMethod?: string;
  pattern?: string;
  generator?: () => any;
}

export interface TestScenario {
  name: string;
  description?: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  data?: any;
  expectedStatus?: number;
  expectedResponse?: any;
  validations?: any[];
}

export class ApiTestDataManager {
  private static instance: ApiTestDataManager;
  private testDataDir: string;
  private templates: Map<string, TestDataTemplate> = new Map();
  private scenarios: Map<string, TestScenario> = new Map();

  constructor(testDataDir: string = './testdata/api') {
    this.testDataDir = testDataDir;
    this.ensureTestDataDirectory();
    this.loadTemplates();
    this.loadScenarios();
  }

  static getInstance(testDataDir?: string): ApiTestDataManager {
    if (!ApiTestDataManager.instance) {
      ApiTestDataManager.instance = new ApiTestDataManager(testDataDir);
    }
    return ApiTestDataManager.instance;
  }

  /**
   * Generate test data based on template
   */
  generateTestData(templateName: string, overrides?: Record<string, any>): any {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Test data template '${templateName}' not found`);
    }

    const generated = this.processTemplate(template.data);
    
    if (overrides) {
      return { ...generated, ...overrides };
    }
    
    return generated;
  }

  /**
   * Generate test data with faker
   */
  generateWithFaker(fields: DataGeneration[]): any {
    const result: any = {};
    
    fields.forEach(field => {
      switch (field.type) {
        case 'faker':
          result[field.field] = this.getFakerValue(field.fakerMethod || 'lorem.word');
          break;
        case 'static':
          result[field.field] = field.value;
          break;
        case 'pattern':
          result[field.field] = this.generateFromPattern(field.pattern || '');
          break;
        case 'function':
          result[field.field] = field.generator ? field.generator() : null;
          break;
      }
    });
    
    return result;
  }

  /**
   * Create user test data
   */
  createUser(overrides?: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    age: number;
    address: any;
  }>): any {
    const defaultUser = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      username: faker.internet.userName(),
      password: faker.internet.password({ length: 12, memorable: true }),
      age: faker.number.int({ min: 18, max: 80 }),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country()
      }
    };

    return { ...defaultUser, ...overrides };
  }

  /**
   * Create product test data
   */
  createProduct(overrides?: Partial<{
    name: string;
    description: string;
    price: number;
    category: string;
    sku: string;
    inStock: boolean;
    quantity: number;
  }>): any {
    const defaultProduct = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      sku: faker.string.alphanumeric(8).toUpperCase(),
      inStock: faker.datatype.boolean(),
      quantity: faker.number.int({ min: 0, max: 100 })
    };

    return { ...defaultProduct, ...overrides };
  }

  /**
   * Create order test data
   */
  createOrder(overrides?: any): any {
    const defaultOrder = {
      orderId: faker.string.uuid(),
      userId: faker.string.uuid(),
      items: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
        productId: faker.string.uuid(),
        quantity: faker.number.int({ min: 1, max: 10 }),
        price: parseFloat(faker.commerce.price())
      })),
      totalAmount: 0, // Will be calculated
      status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered']),
      orderDate: faker.date.recent().toISOString(),
      shippingAddress: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country()
      }
    };

    // Calculate total amount
    defaultOrder.totalAmount = defaultOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return { ...defaultOrder, ...overrides };
  }

  /**
   * Generate invalid data for negative testing
   */
  generateInvalidData(type: 'user' | 'product' | 'order' | 'custom', customFields?: string[]): any {
    const invalidStrategies = {
      emptyString: '',
      nullValue: null,
      undefinedValue: undefined,
      longString: 'x'.repeat(1000),
      specialChars: '!@#$%^&*()_+{}|:<>?[]\\;\'\".,/',
      sql: "'; DROP TABLE users; --",
      xss: '<script>alert("XSS")</script>',
      negativeNumber: -1,
      largeNumber: Number.MAX_SAFE_INTEGER,
      invalidEmail: 'invalid-email',
      invalidDate: '2023-13-32',
      invalidPhone: '123',
      wrongType: 123 // for string fields
    };

    let baseData: any;
    let fields: string[];

    switch (type) {
      case 'user':
        baseData = this.createUser();
        fields = ['firstName', 'lastName', 'email', 'phone', 'username'];
        break;
      case 'product':
        baseData = this.createProduct();
        fields = ['name', 'description', 'price', 'category'];
        break;
      case 'order':
        baseData = this.createOrder();
        fields = ['orderId', 'userId', 'totalAmount'];
        break;
      case 'custom':
        baseData = {};
        fields = customFields || [];
        break;
      default:
        throw new Error(`Invalid data type: ${type}`);
    }

    const invalidVariations: any[] = [];
    const strategies = Object.entries(invalidStrategies);

    fields.forEach(field => {
      strategies.forEach(([strategyName, strategyValue]) => {
        const invalidData = { ...baseData };
        invalidData[field] = strategyValue;
        invalidVariations.push({
          description: `${field} with ${strategyName}`,
          data: invalidData,
          invalidField: field,
          strategy: strategyName
        });
      });
    });

    return invalidVariations;
  }

  /**
   * Load test data from JSON file
   */
  loadTestData(filename: string): any {
    const filePath = path.join(this.testDataDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Save test data to JSON file
   */
  saveTestData(filename: string, data: any): void {
    const filePath = path.join(this.testDataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  /**
   * Create test scenario
   */
  createScenario(scenario: TestScenario): void {
    this.scenarios.set(scenario.name, scenario);
    this.saveScenarios();
  }

  /**
   * Get test scenario
   */
  getScenario(name: string): TestScenario | undefined {
    return this.scenarios.get(name);
  }

  /**
   * Get all scenarios for a specific method
   */
  getScenariosByMethod(method: string): TestScenario[] {
    return Array.from(this.scenarios.values()).filter(s => s.method === method);
  }

  /**
   * Create data template
   */
  createTemplate(template: TestDataTemplate): void {
    this.templates.set(template.name, template);
    this.saveTemplates();
  }

  /**
   * Get all templates
   */
  getTemplates(): TestDataTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Generate test data matrix for parameterized tests
   */
  generateTestMatrix(baseData: any, variations: Record<string, any[]>): any[] {
    const matrix: any[] = [];
    const fields = Object.keys(variations);
    
    if (fields.length === 0) {
      return [baseData];
    }

    const generateCombinations = (index: number, current: any): void => {
      if (index === fields.length) {
        matrix.push({ ...baseData, ...current });
        return;
      }

      const field = fields[index];
      const values = variations[field];
      
      values.forEach(value => {
        generateCombinations(index + 1, { ...current, [field]: value });
      });
    };

    generateCombinations(0, {});
    return matrix;
  }

  /**
   * Generate boundary value test data
   */
  generateBoundaryValues(field: string, type: 'string' | 'number' | 'array', constraints?: any): any[] {
    const values: any[] = [];

    switch (type) {
      case 'string':
        const minLength = constraints?.minLength || 0;
        const maxLength = constraints?.maxLength || 100;
        values.push(
          'x'.repeat(minLength), // minimum
          'x'.repeat(minLength + 1), // minimum + 1
          'x'.repeat(maxLength - 1), // maximum - 1
          'x'.repeat(maxLength), // maximum
          'x'.repeat(maxLength + 1) // maximum + 1
        );
        break;

      case 'number':
        const min = constraints?.min || 0;
        const max = constraints?.max || 100;
        values.push(
          min, // minimum
          min + 1, // minimum + 1
          max - 1, // maximum - 1
          max, // maximum
          max + 1 // maximum + 1
        );
        break;

      case 'array':
        const minItems = constraints?.minItems || 0;
        const maxItems = constraints?.maxItems || 10;
        values.push(
          Array(minItems).fill('item'), // minimum items
          Array(minItems + 1).fill('item'), // minimum + 1 items
          Array(maxItems - 1).fill('item'), // maximum - 1 items
          Array(maxItems).fill('item'), // maximum items
          Array(maxItems + 1).fill('item') // maximum + 1 items
        );
        break;
    }

    return values.map(value => ({ [field]: value }));
  }

  /**
   * Validate test data against schema
   */
  validateData(data: any, templateName: string): { isValid: boolean; errors: string[] } {
    const template = this.templates.get(templateName);
    if (!template) {
      return { isValid: false, errors: [`Template '${templateName}' not found`] };
    }

    const errors: string[] = [];
    
    if (template.validators) {
      Object.entries(template.validators).forEach(([field, validator]) => {
        const value = data[field];
        const result = validator(value);
        
        if (typeof result === 'string') {
          errors.push(`${field}: ${result}`);
        } else if (!result) {
          errors.push(`${field}: validation failed`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Private helper methods
  private ensureTestDataDirectory(): void {
    if (!fs.existsSync(this.testDataDir)) {
      fs.mkdirSync(this.testDataDir, { recursive: true });
    }
  }

  private loadTemplates(): void {
    const templatesFile = path.join(this.testDataDir, 'templates.json');
    if (fs.existsSync(templatesFile)) {
      try {
        const content = fs.readFileSync(templatesFile, 'utf-8');
        const templates = JSON.parse(content);
        templates.forEach((template: TestDataTemplate) => {
          this.templates.set(template.name, template);
        });
      } catch (error) {
        console.warn('Failed to load templates:', error);
      }
    }
  }

  private saveTemplates(): void {
    const templatesFile = path.join(this.testDataDir, 'templates.json');
    const templates = Array.from(this.templates.values());
    fs.writeFileSync(templatesFile, JSON.stringify(templates, null, 2));
  }

  private loadScenarios(): void {
    const scenariosFile = path.join(this.testDataDir, 'scenarios.json');
    if (fs.existsSync(scenariosFile)) {
      try {
        const content = fs.readFileSync(scenariosFile, 'utf-8');
        const scenarios = JSON.parse(content);
        scenarios.forEach((scenario: TestScenario) => {
          this.scenarios.set(scenario.name, scenario);
        });
      } catch (error) {
        console.warn('Failed to load scenarios:', error);
      }
    }
  }

  private saveScenarios(): void {
    const scenariosFile = path.join(this.testDataDir, 'scenarios.json');
    const scenarios = Array.from(this.scenarios.values());
    fs.writeFileSync(scenariosFile, JSON.stringify(scenarios, null, 2));
  }

  private processTemplate(template: any): any {
    if (typeof template === 'string' && template.startsWith('{{') && template.endsWith('}}')) {
      const fakerMethod = template.slice(2, -2).trim();
      return this.getFakerValue(fakerMethod);
    } else if (Array.isArray(template)) {
      return template.map(item => this.processTemplate(item));
    } else if (typeof template === 'object' && template !== null) {
      const result: any = {};
      Object.entries(template).forEach(([key, value]) => {
        result[key] = this.processTemplate(value);
      });
      return result;
    }
    
    return template;
  }

  private getFakerValue(method: string): any {
    try {
      const parts = method.split('.');
      let current: any = faker;
      
      for (const part of parts) {
        current = current[part];
      }
      
      if (typeof current === 'function') {
        return current();
      }
      
      return current;
    } catch (error) {
      console.warn(`Failed to generate faker value for '${method}':`, error);
      return `{{${method}}}`;
    }
  }

  private generateFromPattern(pattern: string): string {
    // Simple pattern replacement
    // # = digit, A = uppercase letter, a = lowercase letter
    return pattern.replace(/[#Aa]/g, (match) => {
      switch (match) {
        case '#':
          return faker.string.numeric(1);
        case 'A':
          return faker.string.alpha({ length: 1, casing: 'upper' });
        case 'a':
          return faker.string.alpha({ length: 1, casing: 'lower' });
        default:
          return match;
      }
    });
  }
}