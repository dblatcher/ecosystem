import { h } from 'preact';
import GridContainer from '../../components/GridContainer';
import style from './style.css';

const Home = () => (
	<div class={style.home}>
		<h1>Home</h1>
		<p>This is the Home component.</p>
		<GridContainer />
	</div>
);

export default Home;
