// SessionData class manages the user session state
class SessionData {
    // Initialize session state with a default value of null
    session = $state(null);

    // Method to set the session state with user data
    setSession(userData) {
        this.session = userData;
    }
}

// Export an instance of SessionData for managing user session
export const userSession = new SessionData();