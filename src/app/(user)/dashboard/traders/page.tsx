import { getPublicTraders } from '@/actions/user/traders';
import TradersClient from './TradersClient';

export default async function TradersPage() {
	const traders = await getPublicTraders();
	return <TradersClient traders={traders} />;
}
