import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

export const GeneralTab = () => {
	return (
		<Card>
			<ListGroup variant='flush'>
				<ListGroup.Item>
					<div className='customization-title'>Layout Personalization</div>
				</ListGroup.Item>
				<ListGroup.Item>
					<div className='customization-title'>Color Customization</div>
				</ListGroup.Item>
			</ListGroup>
		</Card>
	);
};
