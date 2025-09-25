#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'awmp-meal-planner',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
    resources: {}
  }
});

// Pantry management tools
server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'add_pantry_item',
      description: 'Add an item to the pantry with expiry date',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Item name' },
          quantity: { type: 'number', description: 'Quantity' },
          unit: { type: 'string', description: 'Unit (kg, lbs, pieces)' },
          expiry_date: { type: 'string', description: 'Expiry date (YYYY-MM-DD)' },
          category: { type: 'string', description: 'Food category' }
        },
        required: ['name', 'quantity', 'unit', 'expiry_date']
      }
    },
    {
      name: 'get_pantry_items',
      description: 'Get all pantry items or filter by expiry status',
      inputSchema: {
        type: 'object',
        properties: {
          filter: { type: 'string', enum: ['all', 'expiring_soon', 'expired'] }
        }
      }
    },
    {
      name: 'suggest_recipes',
      description: 'Get recipe suggestions based on available ingredients',
      inputSchema: {
        type: 'object',
        properties: {
          ingredients: { type: 'array', items: { type: 'string' } },
          dietary_restrictions: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    {
      name: 'create_meal_plan',
      description: 'Create a weekly meal plan',
      inputSchema: {
        type: 'object',
        properties: {
          week_start: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          meals: {
            type: 'object',
            properties: {
              monday: { type: 'array', items: { type: 'string' } },
              tuesday: { type: 'array', items: { type: 'string' } },
              wednesday: { type: 'array', items: { type: 'string' } },
              thursday: { type: 'array', items: { type: 'string' } },
              friday: { type: 'array', items: { type: 'string' } },
              saturday: { type: 'array', items: { type: 'string' } },
              sunday: { type: 'array', items: { type: 'string' } }
            }
          }
        },
        required: ['week_start', 'meals']
      }
    }
  ]
}));

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'add_pantry_item':
      return {
        content: [{
          type: 'text',
          text: `Added ${args.name} (${args.quantity} ${args.unit}) to pantry. Expires: ${args.expiry_date}`
        }]
      };

    case 'get_pantry_items':
      const mockItems = [
        { name: 'Milk', quantity: 1, unit: 'liter', expiry_date: '2024-01-15', status: 'expiring_soon' },
        { name: 'Bread', quantity: 1, unit: 'loaf', expiry_date: '2024-01-20', status: 'fresh' },
        { name: 'Eggs', quantity: 12, unit: 'pieces', expiry_date: '2024-01-25', status: 'fresh' }
      ];
      
      const filtered = args.filter === 'all' ? mockItems : 
                     mockItems.filter(item => item.status === args.filter);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(filtered, null, 2)
        }]
      };

    case 'suggest_recipes':
      const recipes = [
        'Scrambled Eggs with Toast',
        'Milk-based Smoothie',
        'French Toast'
      ];
      return {
        content: [{
          type: 'text',
          text: `Recipe suggestions based on available ingredients: ${recipes.join(', ')}`
        }]
      };

    case 'create_meal_plan':
      return {
        content: [{
          type: 'text',
          text: `Meal plan created for week starting ${args.week_start}`
        }]
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);