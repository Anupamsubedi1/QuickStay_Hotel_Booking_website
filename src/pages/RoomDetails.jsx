import React, { use } from 'react'
import { roomsDummyData } from '../assets/assets';

const RoomDetails = () => {
    const { id } = useParams();
    const [room, setRoom] = React.useState(null);
    const [mainImage, setMainImage] = React.useState(null);
    useEffect(() => {
       const room = roomsDummyData.find(room => room.id === id)
        room && setRoom(room);
        room && setMainImage(room.images[0]);

    }, [id]);
    

  return room && (
    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
        {/* {room details} */}

        <div>
            <h1>{room.hotel.name} <span>({ room.roomType})</span> </h1>
        </div>


    </div>
  )
}

export default RoomDetails