import React from 'react'

function ProductDetails() {
  return (
    <div className="relative flex w-[50rem] flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="relative h-96 overflow-hidden rounded-t-xl mb-4 flex items-center bg-gray-200">
        <div className="flex gap-4 w-full">
          <div className="relative h-96 rounded-lg overflow-hidden flex-grow">
            <img
              src="/headset.png"
              alt="Headset Image"
              className="w-full h-full object-cover rounded-t-xl"
            />
          </div>
          <div className="flex flex-col space-y-2 ml-auto mr-4 mt-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <button
                key={index}
                className="relative h-16 w-16 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 focus:outline-none"
                onClick={() => console.log(`Clicked image ${index}`)}
              >
                <img
                  src="/headset.png"
                  alt={`Small Image ${index}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-row p-6 gap-4">
        <div className="flex-1">
          <h5 className="mb-2 flex justify-between font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
            <span>Macbook M3 Pro</span>
            <span>1300€</span>
          </h5>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              <svg className="w-3 h-3 text-purple-600 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Fulda, Germany
            </span>
          </div>
          <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased text-justify mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum purus arcu, rutrum ornare erat et, lacinia tempus sapien. Quisque quam urna, malesuada in dolor eget, tincidunt placerat velit. Mauris vitae nunc rutrum, faucibus est sit amet, bibendum sapien. Nullam sollicitudin leo vel venenatis posuere. Sed non enim ac urna efficitur iaculis. Mauris condimentum metus nec lacus efficitur feugiat. Nulla facilisi. Morbi eget rhoncus quam, id pulvinar eros. Nunc malesuada mattis lobortis. Praesent in quam neque. 
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <button data-ripple-light="true" type="button" className="select-none rounded-lg bg-purple-600 py-3 px-6 text-center align-middle font-sans text-xs font-bold text-white shadow-md shadow-purple-500/20 transition-all hover:shadow-lg hover:shadow-purple-700/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none w-full">
            Log in to Contact Seller
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails; 