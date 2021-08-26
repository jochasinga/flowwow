import React, {useState, useEffect} from "react";
import * as fcl from "@onflow/fcl";

const AuthCluster = () => {
    const [user, setUser] = useState({loggedIn: null});
    useEffect(() => fcl.currentUser().subscribe(setUser), []);

    if (user.loggedIn) {
        return (
            <div>
                <span>{user?.addr ?? "No Address"}</span>
                <a className="button is-primary" onClick={fcl.unauthenticate}>
                    Log Out
                </a>
            </div>
        );
    }
    return (
      <div className="buttons">
          <a className="button is-primary" onClick={fcl.logIn}>Log In</a>
          <a className="button is-secondary" onClick={fcl.signUp}>Sign Up</a>
      </div>
    );
}

export default AuthCluster;