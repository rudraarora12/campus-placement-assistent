const fs = require('fs');
const path = require('path');
const { AIProjectClient } = require('@azure/ai-projects');
const { DefaultAzureCredential } = require('@azure/identity');

// Ensure Azure CLI directory is available in PATH on Windows for DefaultAzureCredential
const possibleAzureCliPaths = [
  'C:\\Program Files\\Microsoft SDKs\\Azure\\CLI2\\wbin',
  'C:\\Program Files (x86)\\Microsoft SDKs\\Azure\\CLI2\\wbin',
];

for (const cliPath of possibleAzureCliPaths) {
  if (fs.existsSync(cliPath) && !process.env.PATH.includes(cliPath)) {
    process.env.PATH = `${cliPath};${process.env.PATH}`;
  }
}

const KNOWLEDGE_BOUNDARY_INSTRUCTIONS = `[KNOWLEDGE BOUNDARY & REASONING GUIDELINES]
You are the official Campus Placement Assistant. Your knowledge boundary is strictly defined by the uploaded placement documents accessed through your File Search tool.

Follow these rules:
1. KNOWLEDGE BOUNDARY:
   - The uploaded placement documents are your authoritative source of truth. Always use the File Search tool to retrieve relevant placement facts.
   - Do NOT introduce facts, statistics, policies, company rules, salary numbers, or dates from outside the uploaded documents.
   - Do NOT use general pretrained knowledge to invent or supplement placement policies.

2. INTELLIGENT & NATURAL REASONING:
   - Understand, summarize, paraphrase, and explain information naturally, clearly, and helpfully in simple language.
   - You can combine multiple pieces of information from different sections of the documents.
   - You can compare companies, packages, and eligibility criteria present in the documents.
   - You can perform basic reasoning, logical comparisons, and calculations using facts from the document together with information explicitly provided by the user (for example, comparing a user's CGPA, batch, or background against documented criteria).

3. USER-PROVIDED DATA & ELIGIBILITY:
   - When users provide their details (e.g., "My CGPA is 8.0. Am I eligible?"), apply the documented criteria and explain clearly if and why they meet or do not meet each criterion.
   - If the user asks for eligibility and certain criteria (such as backlogs or 10th/12th cutoffs) are missing from the documents or missing from the user's prompt, explain what is verified as met and what additional information is needed or unverified in the documents.

4. MISSING INFORMATION:
   - If a placement-related question asks for information that is NOT available in the uploaded documents and cannot be derived from them, clearly state:
     "I couldn't find this information in the provided placement documents."
   - Do NOT invent or guess missing placement rules, eligibility criteria, company requirements, salary information, deadlines, statistics, or policies.

5. OFF-TOPIC QUESTIONS:
   - If the user asks something completely unrelated to campus placements or the uploaded placement documents, politely say:
     "I can help with questions related to the information available in the placement documents."
   - Do NOT answer unrelated questions using general knowledge.

6. RESPONSE STYLE:
   - Do NOT make every answer sound like "I couldn't find this information..." unless the required facts genuinely cannot be found or derived from the uploaded documents.
   - Provide natural, structured, and informative Markdown responses.

[USER QUESTION]
`;

/**
 * Service to interact with the existing Microsoft Foundry Agent.
 * Uses DefaultAzureCredential exclusively on the backend to authenticate with Azure AI Projects.
 */
class FoundryAgentService {
  constructor() {
    this.endpoint =
      process.env.FOUNDRY_PROJECT_ENDPOINT ||
      'https://placementassistant.services.ai.azure.com/api/projects/PlacementAssistant';
    this.agentName = process.env.FOUNDRY_AGENT_NAME || 'Campus-Placement-Assistant';
    this.agentVersion = process.env.FOUNDRY_AGENT_VERSION || '23';

    this.credential = new DefaultAzureCredential();
    this.projectClient = null;
    this.openaiClient = null;
  }

  /**
   * Lazily initializes and returns the authenticated OpenAI client from the AIProjectClient.
   */
  getOpenAIClient() {
    if (!this.openaiClient) {
      if (!this.endpoint) {
        throw new Error('FOUNDRY_PROJECT_ENDPOINT is not configured.');
      }
      if (!this.agentName) {
        throw new Error('FOUNDRY_AGENT_NAME is not configured.');
      }

      this.projectClient = new AIProjectClient(this.endpoint, this.credential);
      this.openaiClient = this.projectClient.getOpenAIClient();
    }
    return this.openaiClient;
  }

  /**
   * Sends user question to the Microsoft Foundry Agent and extracts response text.
   * Enforces natural reasoning within the strict File Search knowledge boundary.
   * @param {string} message - User query
   * @returns {Promise<string>}
   */
  async sendMessage(message) {
    if (!message || typeof message !== 'string' || message.trim() === '') {
      throw new Error('Invalid request: message cannot be empty.');
    }

    const client = this.getOpenAIClient();
    const promptWithBoundary = `${KNOWLEDGE_BOUNDARY_INSTRUCTIONS}${message.trim()}`;

    // Responses API request targeting the existing Foundry Agent reference
    const response = await client.responses.create({
      input: [{ role: 'user', content: promptWithBoundary }],
      agent_reference: {
        name: this.agentName,
        version: this.agentVersion,
        type: 'agent_reference',
      },
    });

    // Extract generated text from response
    let text = '';
    if (response.output_text) {
      text = response.output_text;
    } else if (response.output && Array.isArray(response.output)) {
      for (const item of response.output) {
        if (item.content && Array.isArray(item.content)) {
          for (const part of item.content) {
            if (part && part.text) {
              text += part.text;
            } else if (typeof part === 'string') {
              text += part;
            }
          }
        } else if (typeof item === 'string') {
          text += item;
        }
      }
    } else if (response.choices && response.choices[0]?.message?.content) {
      text = response.choices[0].message.content;
    }

    if (!text && typeof response === 'string') {
      text = response;
    }

    return text || 'No response received from agent.';
  }
}

const foundryAgentService = new FoundryAgentService();
module.exports = foundryAgentService;
