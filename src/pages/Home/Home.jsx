import { Link } from 'react-router-dom';

import ProgressButton from '../../components/ProgressButton/ProgressButton';
import StatButton from '../../components/StatButton/StatButton';

export default function Home() {

    return (
        <>
            <Link to="/stat">
                <StatButton />
            </Link>
            <Link to="/progress">
                <ProgressButton />
            </Link>
        </>
    )
}