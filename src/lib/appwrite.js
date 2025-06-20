
/**
 * Node modules
 */
import { Client, Account, Avatars, Databases } from 'appwrite';

/**
 * Initial appwrite client
 */
const client = new Client();

client
  .setProject('6852b10e002ab25462ca')
  .setEndpoint('https://fra.cloud.appwrite.io/v1');

/**
 * Initial appwrite account
 */
const account = new Account(client);

/**
 * Initial appwrite avatars
 */
const avatars = new Avatars(client);

/**
 * Initial appwrite databases
 */
const databases = new Databases(client);

export { account, avatars, databases };
