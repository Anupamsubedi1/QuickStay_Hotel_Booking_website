import React from 'react'
import Title from '../../component/Title';
import { assets } from '../../assets/assets';

const AddRoom = () => {

  const [images, setImages] = React.useState({
    1:null,
    2:null,
    3:null,
    4:null
  });
  
  const [inputs, setInputs] = React.useState({
    
    roomType:'',
    pricePerNight:0,
    amenities:{
      'Free Wifi':false,
      'Free Breakfast':false,
      'Room Service':false,
      'Mountain view':false,
      'Swimming Pool':false
    }
  });
  return (
    <form action="">
      <Title align='left' font='outfit' title='Add Room' subTitle='Fill in the details below to add a new room to your listings.' />
      {/* upload area for images */}
      <p className='text-gray-800 mt-10 '>Images</p>
      <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
        {Object.keys(images).map((key)=>
        ( <label htmlFor={`room images${key}` } key={key}> 
        <img src={images[key] ? URL.createObjectURL(images[key]): assets.uploadArea } alt="" className='max-h-13 cursor-pointer opacity-80'/>
        <input type="file" id={`room images${key}`}  accept='image/*' hidden onChange={e=>setImages({...images,[key]: e.target.files[0]})}/>
        </label> )
        )}
      </div>

      <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>
        <div className='flex-1 max-w-48'>
          <p className='text-gray-800 mt-4'>Room Type</p>
          <select  value = {inputs.roomType} onChange={e=>setInputs({...inputs,roomType:e.target.value})}
          className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full'>
            <option value="">Select Room Type</option>
            <option value="single Bed">Single Bed</option>
            <option value="double Bed">Double Bed</option>
            <option value="Luxury Room">Suite</option>
            <option value="Single Bed">Single Bed</option>
          </select>
        </div>
        <div>
            {/* Price */}
            <p className="mt-4 text-gray-800">
              Price <span className="text-xs">/night</span>
            </p>

            <input
              type="number"
              placeholder="0"
              className="border border-gray-300 mt-1 rounded p-2 w-24"
              value={inputs.pricePerNight}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  pricePerNight: e.target.value,
                })
              }
            />

            
          </div>

        
      </div>
          {/* Amenities */}
            <p className="text-gray-800 mt-4">Amenities</p>

            <div className="flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm">
              {Object.keys(inputs.amenities).map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`amenities${index + 1}`}
                    checked={inputs.amenities[amenity]}
                    onChange={() =>
                      setInputs({
                        ...inputs,
                        amenities: {
                          ...inputs.amenities,
                          [amenity]: !inputs.amenities[amenity],
                        },
                      })
                    }
                  />
                  <label htmlFor={`amenities${index + 1}`}>
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
    </form>
  )
}

export default AddRoom