import axios from 'axios';

// Define the DevRev API URL (update with actual endpoint)
const DEVREV_API_URL = 'https://api.devrev.ai'; // Replace with the correct DevRev API URL
const API_KEY = 'your_api_key';  // Replace with your actual API key for authentication

export default async function routeTicket(ticket: any) {
  const department = ticket.custom_fields.department;

  // Logic for determining the group based on department type
  let group = '';
  if (department === 'Sales') {
    group = 'Sales Support';
  } else if (department === 'Pre-Sales') {
    group = 'Pre-Sales Support;
  } else if (department === 'Technical') {
    group = 'Technical Support';
  } else if (department === 'Accounts') {
    group = 'Accounts Support';
  }

  try {
    // Fetch the agents for the group (Replace this with the appropriate API call)
    const agentsResponse = await axios.get(`${DEVREV_API_URL}/agents`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      params: {
        group: group, // Assuming group can be a filter
      },
    });

    const agents = agentsResponse.data; // Assuming the response contains an array of agents
    if (agents.length === 0) {
      throw new Error(`No agents found for group: ${group}`);
    }

    // Simple round-robin load balancing approach
    const agent = agents[Math.floor(Math.random() * agents.length)];

    // Route the ticket to the selected agent
    const assignResponse = await axios.post(`${DEVREV_API_URL}/tickets/assign`, {
      ticket_id: ticket.id,
      agent_id: agent.id,
    }, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Return the response from the API (success or failure)
    return assignResponse.data;
  } catch (error) {
    console.error('Error routing ticket:', error);
    throw error;
  }
}








