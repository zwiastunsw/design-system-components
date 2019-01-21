import React from 'react';
import ReactDOM from 'react-dom';

import CORE_OVERVIEW from '../components/button/lib/OVERVIEW-GEN.md';
// import AUButton from '../components/button/src/react/button';

class App extends React.Component {
    coreOverview() {
        return { __html: CORE_OVERVIEW };
    }
    render() {
        return (
            <main className="app">
                <h1>Design System Website</h1>
                <div dangerouslySetInnerHTML={this.coreOverview()}></div>
            </main>
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
  );