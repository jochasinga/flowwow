import {useState, useEffect} from "react";
import * as fcl from "@onflow/fcl";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import 'tippy.js/themes/light.css';
import setupReceiverAccount from "flow/transactions/pets/SetupReceiverAccount.tx";
import getAllTokenIds from "flow/scripts/pets/GetAllTokenIds.script";
import getAccountTokenIds from "flow/scripts/pets/GetAccountTokenIds.script ";

const AuthCluster = () => {
    const [user, setUser]: [any, any] = useState({loggedIn: null});
    useEffect(() => {
        const setupAccount = async () => {
            const txId = await setupReceiverAccount();
            console.log("txId: ", txId);
            console.log(
                "successfully setup receiver collection for",
                fcl.currentUser()
            );
        }

        fcl.currentUser().subscribe(setUser);
        if (user.loggedIn) {
            setupAccount();
        }
    }, []);

    // useEffect(() => {
    //     const f = async () => {
    //         if (user?.addr) {
    //             let tokenIds = await getAccountTokenIds(user?.addr);
    //             console.log("I have ...", tokenIds);
    //         }
    //     }
    //     f();
    // }, [user.loggedIn]);

    if (user.loggedIn) {
        localStorage.setItem("user", user);
        return (
            <>
                <div className="navbar-item">
                    <span className="tag is-light is-medium">
                        {user?.addr ?? "No Address"}
                    </span>
                </div>
                <button className="button is-primary is-light" onClick={async () => {
                    let txId = await setupReceiverAccount();
                    console.log("TXID: ", txId);
                }}>
                    Activate Account
                </button>
                <button className="button is-primary is-light" onClick={async () => {
                    let ids = await getAccountTokenIds(user.addr);
                    console.log("Token IDs ", ids);
                }}>
                    Get IDS
                </button>
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