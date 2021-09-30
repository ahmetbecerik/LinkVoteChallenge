import React from "react";
import Listing from "./components/Listing";
import Adding from "./components/Adding";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";


function App() {
    return(
        <Router>
            <div>
                <Switch>
                    <Route exact path="/">
                        <Listing />
                    </Route>
                    <Route path="/adding">
                        <Adding />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App;
