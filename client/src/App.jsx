import React from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { RestaurantsContextProvider } from './context/RestaurantsContext';
import HomePage from './routes/HomePage';
import RestaurantDetailPage from './routes/RestaurantDetailPage';
import UpdatePage from './routes/UpdatePage';


const App = () => {
	return( 
	<RestaurantsContextProvider>
		<div className="container">
			<Router>
				<Switch>			
					<Route exact path="/" component={HomePage}/>
					<Route exact path="/restaurants/:id/update" component={UpdatePage}/>
					<Route exact path="/restaurants/:id" component={RestaurantDetailPage}/>
				</Switch>
			</Router>
		</div>
	</RestaurantsContextProvider>
	)
}

export default App;