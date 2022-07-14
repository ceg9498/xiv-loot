import React from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from 'react-router-dom';
import {
	AppProps,
	AppState,
} from './types';
import { ErrorPage, NewUser, TeamPage } from './Pages';

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
		/*/ obtain sets listed in Team Data
		this.callBackendAPI('/team')
			.then(res => {
				console.log('mount test res',res);
			})
			.catch(err => console.error('[server error]', err));
			*/
	}

	render(){
		return(
		<Router>
			<Routes>
				<Route path='team/:id' element={<TeamPage />} />
				<Route path='team/:teamid/:userid' element={<NewUser />} />
				<Route path='*' element={<ErrorPage msg="no team requested" />} />
			</Routes>
		</Router>
		);
	}
}

export default App;
