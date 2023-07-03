import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { Loader, FormField } from '../components';
import Api from "../components/apiu"

const CreatePostScreen = () => {
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const[image,setImage]=useState(null)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch(
          "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "Authorization":`Bearer ${Api}`
            },
            body: JSON.stringify({ inputs: form.prompt }),
          }
        )
        const blob = await response.blob();
       setImage(URL.createObjectURL(blob));
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please enter a prompt to create an image.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (image) {
      try {
        setLoading(true);
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = image;
        link.download = 'generated_image.png'; // Set the default file name and extension

        // Add additional logic here to set the desired format and file name based on user selection

        // Trigger the download
        link.click();
      } catch (error) {
        alert('Failed to download the image.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image before sharing.');
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>Create</h1>
        <p className='mt-2 text-[#666e75] text-[14px] mx-w-[500px]'>Create Imaginative Ai generated Images and Share them with the community</p>
      </div>
      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField LabelName="Your Name"
                          type="text"
                          name="name"
                          placeHolder="Enter Name Here"
                          value={form.name}
                          handleChange={handleChange}/>
          <FormField LabelName="Prompt"
                          type="text"
                          name="prompt"
                          placeHolder="a painting of a fox in the style of Starry Night"
                          value={form.prompt}
                          handleChange={handleChange}
                          isSurpriseMe
                          handleSurpriseMe={handleSurpriseMe}
                          />
                          <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm
                          rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center
                           items-center'>
                            {image ?(
        <div>
          <img src={image} alt="art" />
        </div>
       ):(
                            <img src={preview} className='w-9/12 h-9/12 object-contain opacity-40'/>
                            )}
                            {generatingImg && (
                              <div className='absolute inset-0 z-0 flex justify-center items-center 
                              bg-[rgba(0,0,0,0.5)] rounded-lg'> <Loader/></div>
                            ) }

                          </div>
        </div>
        <div className='mt-5 flex gap-5'>
          <button type='button' onClick={generateImage}
          className='text-white bg-green-700 font-medium rounded-md text-sm w-full
          sm:w-auto px-5 py-2.5 text-center'>

            {generatingImg ? "Generating..." : "Generate"}
           
          </button>

        </div>
        <div className='mt-10'>
          <p className='mt-2 text-[#666e75] text-[14px]'>Once You Have Created An Image You Can Download It</p>
          <button type='submit' className='mt-3 text-white bg-[#6469ff] font-medium rounded -md text-sm w-full sm:w-auto
          px-5 py-2.5 text-center'>
            {loading  ? 'Downloading...':"Download"}
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreatePostScreen
