import { APIRequestContext, request } from '@playwright/test';

/**
 * API Helper utility for TOSCA-converted test scenarios
 * Handles API requests for:
 * - Get Connection String (GET)
 * - Create Payoff Order (POST)
 * All endpoints from TOSCA ApiModule definitions
 */
export class APIHelper {
  private apiContext: APIRequestContext | null = null;

  /**
   * Initialize the API context
   */
  private async getContext(): Promise<APIRequestContext> {
    if (!this.apiContext) {
      this.apiContext = await request.newContext({
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
        },
      });
    }
    return this.apiContext;
  }

  /**
   * GET Request to retrieve database connection string
   * API Module: Get Connection String request (01KDRQ37XLY5SPN8AKFEMZXYKQ)
   * Endpoint: https://qas-api-loanpayoff.iaai.com/GetDBConnectionString
   * @param url - The API endpoint URL
   */
  async getConnectionString(url: string) {
    const context = await this.getContext();
    const response = await context.get(url);
    return response;
  }

  /**
   * POST Request to create a new Carrier Payoff Record
   * API Module: Carier Create PO Request (01KDRQ37XM6RDKK4NJMFZ1QRZ1)
   * Endpoint: https://qas-api-loanpayoff.iaai.com/api/Payoff/CreateNewCarrierPayoffRecord
   * @param url - The API endpoint URL
   * @param payload - Request body containing payoff details
   * @param bearerToken - Authorization token
   */
  async createPayoffOrder(
    url: string,
    payload: {
      claimNumber: string;
      VIN: string;
      senderID: number;
      lenderAliasId: number;
    },
    bearerToken: string
  ) {
    const context = await this.getContext();
    const response = await context.post(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      data: payload,
    });
    return response;
  }

  /**
   * Generic GET request
   * @param url - The API endpoint URL
   * @param headers - Optional headers
   */
  async get(url: string, headers?: Record<string, string>) {
    const context = await this.getContext();
    return await context.get(url, { headers });
  }

  /**
   * Generic POST request
   * @param url - The API endpoint URL
   * @param data - Request body
   * @param headers - Optional headers
   */
  async post(url: string, data: Record<string, unknown>, headers?: Record<string, string>) {
    const context = await this.getContext();
    return await context.post(url, { data, headers });
  }

  /**
   * Cleanup - dispose API context
   */
  async dispose() {
    if (this.apiContext) {
      await this.apiContext.dispose();
      this.apiContext = null;
    }
  }
}
