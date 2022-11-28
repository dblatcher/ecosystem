import { h } from 'preact';
import Grid from '../../components/Grid';
import style from './style.css';

const Home = () => (
	<div class={style.home}>
		<h1>Home</h1>
		<p>This is the Home component.</p>
		<Grid />
	</div>
);

export default Home;
