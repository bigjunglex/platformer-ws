import { Connection } from "./components/Connect/Connect";
import { HealthBar } from "./components/HealthBar/HeathBar";


export function UI() {
    return (
        <div id="ui-container">
            <Connection />
            <HealthBar />
        </div>
    )
}