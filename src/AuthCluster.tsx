import {useState, useEffect} from "react";
import * as fcl from "@onflow/fcl";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import 'tippy.js/themes/light.css';

const AuthCluster = () => {
    const [user, setUser]: [any, any] = useState({loggedIn: null});
    useEffect(() => {
        fcl.currentUser().subscribe(setUser);
    }, []);

    if (user.loggedIn) {
        return (
            <>
                <div className="navbar-item">
                    <span className="tag is-light">{user?.addr ?? "No Address"}</span>
                </div>
                <button className="button is-primary is-light" onClick={fcl.unauthenticate}>
                Log Out
                </button>
            </>
        );
    }

    return (
        <Tippy
        className="floating"
        content="Log in to buy pets"
        placement="left"
        theme="light"
        showOnCreate
        inertia
        >
        <div className="content">
            <div className="buttons">
                <button className="button is-primary is-outlined is-inverted" onClick={fcl.logIn}>
                Log In
                </button>
                <button className="button is-primary is-outlined is-inverted" onClick={fcl.signUp}>
                Sign Up
                </button>
            </div>
        </div>
    </Tippy>
    );
}

export default AuthCluster;