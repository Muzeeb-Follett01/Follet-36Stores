import { SexType, faker } from '@faker-js/faker';

// Legacy interface for backward compatibility
interface Student {
    firstName: string;
    lastName: string;
    sex: SexType;
    email: string;
    mobile: string;
    dob: string;
    hobby: string;
    address: string;
}

// Enhanced interfaces for comprehensive data generation
export interface RegistrationFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    username: string;
    password: string;
    confirmPassword: string;
    newsletter: boolean;
    termsAccepted: boolean;
}

export interface EcommerceData {
    customer: CustomerData;
    product: ProductData;
    order: OrderData;
    payment: PaymentData;
}

export interface CustomerData {
    customerId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    loyaltyPoints: number;
    memberSince: Date;
    preferredCategories: string[];
}

export interface ProductData {
    productId: string;
    name: string;
    price: number;
    currency: string;
    category: string;
    brand: string;
    sku: string;
    description: string;
    inStock: boolean;
    quantity: number;
    rating: number;
    reviews: number;
}

export interface OrderData {
    orderNumber: string;
    customerId: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    orderDate: Date;
    expectedDelivery: Date;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface PaymentData {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolder: string;
    cardType: 'visa' | 'mastercard' | 'amex' | 'discover';
    billingAddress: AddressData;
}

export interface AddressData {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface BoundaryTestData {
    strings: {
        empty: string;
        minLength: string;
        maxLength: string;
        exceedsMax: string;
        withSpaces: string;
        withUnicode: string;
        withEmojis: string;
        withSpecialChars: string;
    };
    numbers: {
        zero: number;
        negative: number;
        minimum: number;
        maximum: number;
        belowMin: number;
        aboveMax: number;
        decimal: number;
        large: number;
    };
    dates: {
        today: Date;
        past: Date;
        future: Date;
        invalidDate: string;
        edgeDate: Date;
    };
}

export interface LocaleData {
    locale: string;
    language: string;
    country: string;
    currency: string;
    dateFormat: string;
    phoneFormat: string;
    addressFormat: string;
    user: RegistrationFormData;
    product: ProductData;
}

export class WebDataGenerator {
    private static instance: WebDataGenerator;
    private hobbies = ['Sports', 'Music', 'Reading', 'Gaming', 'Cooking', 'Travel', 'Photography'];
    private categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys'];
    private brands = ['Samsung', 'Apple', 'Nike', 'Adidas', 'Sony', 'Microsoft', 'Google'];

    public static getInstance(): WebDataGenerator {
        if (!WebDataGenerator.instance) {
            WebDataGenerator.instance = new WebDataGenerator();
        }
        return WebDataGenerator.instance;
    }

    // Legacy method for backward compatibility
    static createRandomUser(): Student {
        const sex = faker.person.sexType();
        const firstName = faker.person.firstName(sex);
        const lastName = faker.person.lastName();
        const email = faker.helpers.unique(faker.internet.email, [firstName, lastName]);
        const mobile = faker.phone.number();
        const dob = faker.date.birthdate({ min: 18, max: 75, mode: 'age', refDate: '30-12-2000' }).toString();
        const address = faker.location.streetAddress(true);
        const hobby = faker.helpers.arrayElement(['Sports', 'Music', 'Reading']);

        return { firstName, lastName, sex, email, mobile, dob, hobby, address };
    }

    static generateMultipleUsers(usercount: number): Student[] {
        return faker.helpers.multiple(WebDataGenerator.createRandomUser, { count: usercount });
    }

    // Enhanced Form Data Generation
    generateRegistrationForm(): RegistrationFormData {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const password = this.generateSecurePassword();

        return {
            firstName,
            lastName,
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            phone: faker.phone.number(),
            dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
            gender: faker.helpers.arrayElement(['male', 'female', 'other']),
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            country: faker.location.country(),
            username: faker.internet.userName({ firstName, lastName }).toLowerCase(),
            password,
            confirmPassword: password,
            newsletter: faker.datatype.boolean(),
            termsAccepted: true
        };
    }

    generateLoginForm(): { username: string; password: string; rememberMe: boolean } {
        return {
            username: faker.internet.userName().toLowerCase(),
            password: this.generateSecurePassword(),
            rememberMe: faker.datatype.boolean()
        };
    }

    generateContactForm(): { name: string; email: string; subject: string; message: string; phone?: string } {
        return {
            name: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            subject: faker.helpers.arrayElement([
                'General Inquiry',
                'Technical Support',
                'Billing Question',
                'Feature Request',
                'Bug Report'
            ]),
            message: faker.lorem.paragraphs(2),
            phone: faker.datatype.boolean() ? faker.phone.number() : undefined
        };
    }

    // E-commerce Domain Data
    generateEcommerceData(): EcommerceData {
        const customer = this.generateCustomer();
        const product = this.generateProduct();
        const order = this.generateOrder(customer.customerId, [product]);
        const payment = this.generatePayment();

        return { customer, product, order, payment };
    }

    generateCustomer(): CustomerData {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const memberSince = faker.date.past({ years: 5 });

        return {
            customerId: faker.string.uuid(),
            firstName,
            lastName,
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            phone: faker.phone.number(),
            dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
            loyaltyPoints: faker.number.int({ min: 0, max: 10000 }),
            memberSince,
            preferredCategories: faker.helpers.arrayElements(this.categories, { min: 1, max: 3 })
        };
    }

    generateProduct(): ProductData {
        const name = faker.commerce.productName();
        const price = parseFloat(faker.commerce.price({ min: 10, max: 1000 }));

        return {
            productId: faker.string.uuid(),
            name,
            price,
            currency: 'USD',
            category: faker.helpers.arrayElement(this.categories),
            brand: faker.helpers.arrayElement(this.brands),
            sku: faker.string.alphanumeric({ length: 8 }).toUpperCase(),
            description: faker.commerce.productDescription(),
            inStock: faker.datatype.boolean(0.9), // 90% chance in stock
            quantity: faker.number.int({ min: 0, max: 100 }),
            rating: parseFloat(faker.number.float({ min: 1, max: 5, fractionDigits: 1 }).toFixed(1)),
            reviews: faker.number.int({ min: 0, max: 1000 })
        };
    }

    generateOrder(customerId: string, products: ProductData[]): OrderData {
        const items: OrderItem[] = products.map(product => {
            const quantity = faker.number.int({ min: 1, max: 5 });
            return {
                productId: product.productId,
                productName: product.name,
                quantity,
                unitPrice: product.price,
                totalPrice: product.price * quantity
            };
        });

        const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
        const total = subtotal + tax + shipping;

        return {
            orderNumber: faker.string.alphanumeric({ length: 10 }).toUpperCase(),
            customerId,
            items,
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            shipping: parseFloat(shipping.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
            orderDate: faker.date.recent(),
            expectedDelivery: faker.date.soon({ days: 7 }),
            status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered'])
        };
    }

    generatePayment(): PaymentData {
        const cardType = faker.helpers.arrayElement(['visa', 'mastercard', 'amex', 'discover'] as const);
        const cardNumber = this.generateValidCardNumber(cardType);

        return {
            cardNumber,
            expiryDate: faker.date.future({ years: 5 }).toISOString().slice(0, 7), // YYYY-MM format
            cvv: cardType === 'amex' ? faker.string.numeric(4) : faker.string.numeric(3),
            cardHolder: faker.person.fullName().toUpperCase(),
            cardType,
            billingAddress: {
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state(),
                zipCode: faker.location.zipCode(),
                country: faker.location.country()
            }
        };
    }

    // Boundary Testing Data
    generateBoundaryTestData(): BoundaryTestData {
        return {
            strings: {
                empty: '',
                minLength: 'a',
                maxLength: 'a'.repeat(255),
                exceedsMax: 'a'.repeat(256),
                withSpaces: '  test with spaces  ',
                withUnicode: 'Test with ñáéíóú 中文 العربية',
                withEmojis: 'Test with emojis 😀🎉🚀',
                withSpecialChars: 'Test!@#$%^&*()_+-=[]{}|;:,.<>?'
            },
            numbers: {
                zero: 0,
                negative: -1,
                minimum: 1,
                maximum: 999999,
                belowMin: 0,
                aboveMax: 1000000,
                decimal: 123.45,
                large: Number.MAX_SAFE_INTEGER
            },
            dates: {
                today: new Date(),
                past: faker.date.past(),
                future: faker.date.future(),
                invalidDate: '2023-13-45', // Invalid month and day
                edgeDate: new Date('2000-02-29') // Leap year
            }
        };
    }

    generateInvalidFormData(): Record<string, any> {
        return {
            invalidEmail: 'not-an-email',
            invalidPhone: '123',
            invalidDate: '32/13/2023',
            invalidZip: 'ABC',
            invalidPassword: '123', // Too short
            invalidAge: -5,
            invalidCreditCard: '1234-5678-9012',
            emptyRequired: '',
            tooLong: 'a'.repeat(1000),
            sqlInjection: "'; DROP TABLE users; --",
            xssAttempt: '<script>alert("xss")</script>'
        };
    }

    // Locale-Specific Data
    generateLocaleData(locale: string = 'en-US'): LocaleData {
        // Note: faker.setLocale is deprecated, using locale-specific instances would be better
        // For now, we'll work with the default locale and adjust format manually
        
        const localeMap: Record<string, any> = {
            'en-US': { currency: 'USD', dateFormat: 'MM/DD/YYYY', phoneFormat: '(XXX) XXX-XXXX' },
            'en-GB': { currency: 'GBP', dateFormat: 'DD/MM/YYYY', phoneFormat: '+44 XXXX XXXXXX' },
            'de-DE': { currency: 'EUR', dateFormat: 'DD.MM.YYYY', phoneFormat: '+49 XXX XXXXXXX' },
            'fr-FR': { currency: 'EUR', dateFormat: 'DD/MM/YYYY', phoneFormat: '+33 X XX XX XX XX' },
            'ja-JP': { currency: 'JPY', dateFormat: 'YYYY/MM/DD', phoneFormat: '+81 XX XXXX XXXX' },
            'es-ES': { currency: 'EUR', dateFormat: 'DD/MM/YYYY', phoneFormat: '+34 XXX XXX XXX' }
        };

        const config = localeMap[locale] || localeMap['en-US'];
        
        return {
            locale,
            language: locale.split('-')[0],
            country: locale.split('-')[1],
            currency: config.currency,
            dateFormat: config.dateFormat,
            phoneFormat: config.phoneFormat,
            addressFormat: this.getAddressFormat(locale),
            user: this.generateRegistrationForm(),
            product: this.generateProduct()
        };
    }

    generateMultiLocaleData(): LocaleData[] {
        const locales = ['en-US', 'en-GB', 'de-DE', 'fr-FR', 'ja-JP', 'es-ES'];
        return locales.map(locale => this.generateLocaleData(locale));
    }

    // Utility Methods
    private generateSecurePassword(): string {
        const length = faker.number.int({ min: 8, max: 16 });
        const minCharPerType = 2; // Ensure at least 2 characters of each type
        
        const lowercase = faker.string.alpha({ length: minCharPerType, casing: 'lower' });
        const uppercase = faker.string.alpha({ length: minCharPerType, casing: 'upper' });
        const numbers = faker.string.numeric(minCharPerType);
        const symbols = faker.helpers.arrayElements(['!', '@', '#', '$', '%', '^', '&', '*'], { min: minCharPerType, max: minCharPerType }).join('');
        
        // Fill remaining length with random characters
        const remainingLength = length - (minCharPerType * 4);
        const additionalChars = remainingLength > 0 ? faker.string.alphanumeric(remainingLength) : '';
        
        const password = lowercase + uppercase + numbers + symbols + additionalChars;
        return faker.helpers.shuffle(password.split('')).join('');
    }

    private generateValidCardNumber(cardType: string): string {
        const prefixes: Record<string, string[]> = {
            visa: ['4'],
            mastercard: ['5'],
            amex: ['34', '37'],
            discover: ['6011', '65']
        };
        
        const prefix = faker.helpers.arrayElement(prefixes[cardType]);
        const remainingLength = (cardType === 'amex' ? 15 : 16) - prefix.length;
        const cardNumber = prefix + faker.string.numeric(remainingLength - 1);
        
        // Add Luhn check digit (simplified)
        const checkDigit = faker.number.int({ min: 0, max: 9 });
        return cardNumber + checkDigit;
    }

    private getAddressFormat(locale: string): string {
        const formats: Record<string, string> = {
            'en-US': 'Street, City, State ZIP',
            'en-GB': 'Street, City, Postcode',
            'de-DE': 'Street, PLZ City',
            'fr-FR': 'Street, Code Postal City',
            'ja-JP': 'Prefecture City Street',
            'es-ES': 'Street, Código Postal City'
        };
        return formats[locale] || formats['en-US'];
    }

    // Bulk Data Generation
    generateBulkRegistrationData(count: number): RegistrationFormData[] {
        return Array.from({ length: count }, () => this.generateRegistrationForm());
    }

    generateBulkProductData(count: number): ProductData[] {
        return Array.from({ length: count }, () => this.generateProduct());
    }

    generateBulkCustomerData(count: number): CustomerData[] {
        return Array.from({ length: count }, () => this.generateCustomer());
    }

    // Custom Data Generator for specific business domains
    generateCustomData(template: CustomDataTemplate): any {
        const result: any = {};
        
        for (const field of template.fields) {
            switch (field.type) {
                case 'faker':
                    result[field.name] = field.fakerMethod ? this.getFakerValue(field.fakerMethod, field.options) : faker.lorem.word();
                    break;
                case 'static':
                    result[field.name] = field.value;
                    break;
                case 'pattern':
                    result[field.name] = field.pattern ? this.generateFromPattern(field.pattern) : faker.string.alphanumeric(8);
                    break;
                case 'conditional':
                    result[field.name] = field.condition ? this.generateConditionalValue(field.condition, result, field.options) : faker.lorem.word();
                    break;
                case 'array':
                    result[field.name] = field.arrayConfig ? this.generateArrayData(field.arrayConfig) : [];
                    break;
                default:
                    result[field.name] = faker.lorem.word();
            }
        }
        
        return result;
    }

    // Healthcare domain data
    generateHealthcareData(): HealthcareData {
        return {
            patientId: faker.string.uuid(),
            medicalRecordNumber: faker.string.alphanumeric({ length: 10 }).toUpperCase(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            dateOfBirth: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
            ssn: this.generateSSN(),
            bloodType: faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
            allergies: faker.helpers.arrayElements(['Peanuts', 'Shellfish', 'Dairy', 'Gluten', 'Penicillin', 'Latex'], { min: 0, max: 3 }),
            emergencyContact: {
                name: faker.person.fullName(),
                relationship: faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Child', 'Friend']),
                phone: faker.phone.number()
            },
            insuranceNumber: faker.string.alphanumeric({ length: 12 }).toUpperCase(),
            primaryPhysician: faker.person.fullName({ sex: 'male' }) + ', MD'
        };
    }

    // Financial domain data
    generateFinancialData(): FinancialData {
        return {
            accountNumber: faker.string.numeric(12),
            routingNumber: faker.string.numeric(9),
            accountType: faker.helpers.arrayElement(['checking', 'savings', 'credit', 'investment']),
            balance: parseFloat(faker.finance.amount({ min: 0, max: 100000, dec: 2 })),
            creditScore: faker.number.int({ min: 300, max: 850 }),
            monthlyIncome: parseFloat(faker.finance.amount({ min: 2000, max: 15000, dec: 2 })),
            expenses: {
                housing: parseFloat(faker.finance.amount({ min: 500, max: 3000, dec: 2 })),
                transportation: parseFloat(faker.finance.amount({ min: 200, max: 800, dec: 2 })),
                utilities: parseFloat(faker.finance.amount({ min: 100, max: 400, dec: 2 })),
                groceries: parseFloat(faker.finance.amount({ min: 300, max: 800, dec: 2 }))
            },
            creditCards: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => ({
                cardNumber: this.generateValidCardNumber('visa'),
                balance: parseFloat(faker.finance.amount({ min: 0, max: 5000, dec: 2 })),
                limit: parseFloat(faker.finance.amount({ min: 1000, max: 10000, dec: 2 }))
            }))
        };
    }

    // Education domain data
    generateEducationData(): EducationData {
        return {
            studentId: faker.string.alphanumeric({ length: 8 }).toUpperCase(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email().toLowerCase(),
            gradeLevel: faker.number.int({ min: 1, max: 12 }),
            gpa: parseFloat(faker.number.float({ min: 0, max: 4, fractionDigits: 2 }).toFixed(2)),
            enrollmentDate: faker.date.past({ years: 2 }),
            courses: Array.from({ length: faker.number.int({ min: 4, max: 8 }) }, () => ({
                courseCode: faker.string.alpha({ length: 4, casing: 'upper' }) + faker.string.numeric(3),
                courseName: faker.lorem.words(3),
                credits: faker.number.int({ min: 1, max: 4 }),
                grade: faker.helpers.arrayElement(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'])
            })),
            financialAid: {
                eligibleForAid: faker.datatype.boolean(),
                scholarshipAmount: faker.datatype.boolean() ? parseFloat(faker.finance.amount({ min: 500, max: 10000, dec: 2 })) : 0,
                loanAmount: faker.datatype.boolean() ? parseFloat(faker.finance.amount({ min: 1000, max: 25000, dec: 2 })) : 0
            }
        };
    }

    // Utility methods for custom data generation
    private getFakerValue(method: string, options?: any): any {
        try {
            const methodParts = method.split('.');
            let fakerMethod: any = faker;
            
            for (const part of methodParts) {
                fakerMethod = fakerMethod[part];
            }
            
            if (typeof fakerMethod === 'function') {
                return options ? fakerMethod(options) : fakerMethod();
            }
            
            return fakerMethod;
        } catch (error) {
            console.warn(`Failed to get faker value for method: ${method}`, error);
            return faker.lorem.word();
        }
    }

    private generateFromPattern(pattern: string): string {
        return pattern.replace(/#/g, () => faker.string.numeric(1))
                    .replace(/\?/g, () => faker.string.alpha({ length: 1, casing: 'upper' }))
                    .replace(/\*/g, () => faker.string.alphanumeric(1));
    }

    private generateConditionalValue(condition: string, context: any, options: any): any {
        // Simple conditional logic - can be expanded
        if (condition.includes('age > 65')) {
            return context.age > 65 ? options.ifTrue : options.ifFalse;
        }
        return options.default;
    }

    private generateArrayData(config: ArrayConfig): any[] {
        const count = faker.number.int({ min: config.minItems || 1, max: config.maxItems || 5 });
        return Array.from({ length: count }, () => {
            if (config.itemType === 'object' && config.itemTemplate) {
                return this.generateCustomData(config.itemTemplate);
            }
            return config.fakerMethod ? this.getFakerValue(config.fakerMethod) : faker.lorem.word();
        });
    }

    private generateSSN(): string {
        // Generate fake SSN format (XXX-XX-XXXX) - not real
        return faker.string.numeric(3) + '-' + faker.string.numeric(2) + '-' + faker.string.numeric(4);
    }
}

// Interfaces for custom data generation
export interface CustomDataTemplate {
    name: string;
    description: string;
    fields: CustomField[];
}

export interface CustomField {
    name: string;
    type: 'faker' | 'static' | 'pattern' | 'conditional' | 'array';
    fakerMethod?: string;
    value?: any;
    pattern?: string;
    condition?: string;
    options?: any;
    arrayConfig?: ArrayConfig;
}

export interface ArrayConfig {
    minItems?: number;
    maxItems?: number;
    itemType: 'primitive' | 'object';
    fakerMethod?: string;
    itemTemplate?: CustomDataTemplate;
}

export interface HealthcareData {
    patientId: string;
    medicalRecordNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    ssn: string;
    bloodType: string;
    allergies: string[];
    emergencyContact: {
        name: string;
        relationship: string;
        phone: string;
    };
    insuranceNumber: string;
    primaryPhysician: string;
}

export interface FinancialData {
    accountNumber: string;
    routingNumber: string;
    accountType: string;
    balance: number;
    creditScore: number;
    monthlyIncome: number;
    expenses: {
        housing: number;
        transportation: number;
        utilities: number;
        groceries: number;
    };
    creditCards: Array<{
        cardNumber: string;
        balance: number;
        limit: number;
    }>;
}

export interface EducationData {
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    gradeLevel: number;
    gpa: number;
    enrollmentDate: Date;
    courses: Array<{
        courseCode: string;
        courseName: string;
        credits: number;
        grade: string;
    }>;
    financialAid: {
        eligibleForAid: boolean;
        scholarshipAmount: number;
        loanAmount: number;
    };
}

// Export both class and instance for convenience
export const webDataGenerator = WebDataGenerator.getInstance();
export const datagenerator = WebDataGenerator; // Legacy export

