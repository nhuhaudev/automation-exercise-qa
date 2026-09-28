import type { APIRequestContext, APIResponse } from '@playwright/test';

export class AutomationExerciseApi {
  constructor(private readonly request: APIRequestContext) {}

  async send(
    endpoint: string,
    options: Parameters<APIRequestContext['fetch']>[1] = {},
  ): Promise<APIResponse> {
    return this.request.fetch(`https://www.automationexercise.com/api/${endpoint}`, options);
  }
}
