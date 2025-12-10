// ========== Database Connection ========== //
import postgres from "postgres";

// Get database connection string from environment variable
const connectionString = process.env.DATABASE_URL;

// Validate that DATABASE_URL is provided
if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is not set. " +
      "Please add it to your .env file."
  );
}

// Create the database connection
// The postgres() function returns a sql`` tagged template function
const sql = postgres(connectionString);

// Export for use in other files
export default sql;
