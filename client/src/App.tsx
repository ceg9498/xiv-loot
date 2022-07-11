import React from 'react';
import {
	AppProps,
	AppState,
} from './types';
import Team from './Pages/team';

class App extends React.Component<AppProps, AppState>{
	constructor(props:any) {
		super(props);
		this.state = {
			teamId: 'test'
		};
	}

	callBackendAPI = async (endpoint:string) => {
		const response = await fetch(endpoint);

		const body = await response.json();

		if (response.status !== 200) {
			console.warn(`error status: [${response.status}] ${response.statusText}`);
			throw Error('error: ',body.message);
		}
		return body;
	};

	componentDidMount() {
		console.clear();
		// obtain sets listed in Team Data
		this.callBackendAPI('/team')
			.then(res => {
				console.log('mount test res',res);
			})
			.catch(err => console.error('[server error]', err));
	}

	render(){
		return(
		<>
		{this.state.teamId !== '' ?
			<Team id={this.state.teamId} />
			:
			<div><span>No Team Requested</span></div>
		}
		</>
		);
	}
}

export default App;
