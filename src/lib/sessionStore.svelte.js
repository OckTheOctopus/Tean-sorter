class SessionData {
    session = $state(null);

    setSession(userData) {
        this.session = userData;
    }
}

export const userSession = new SessionData();