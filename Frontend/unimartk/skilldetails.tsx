import React from 'react'

function SkillDetails() {
  return (
    <div className="relative flex w-[50rem] flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="relative h-64 overflow-hidden rounded-t-xl mb-4 flex items-center justify-center bg-gray-200">
        <img
          src="/headset.png"
          alt="Headset Image"
          className="w-full h-full object-contain rounded-t-xl"
        />
      </div>
      <div className="flex flex-row p-6 gap-4">
        <div className="flex-1">
          <h5 className="mb-2 flex justify-between font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
            <span>Maths Tutoring</span>
            <span>25€</span>
          </h5>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              <svg className="w-3 h-3 text-purple-600 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Angewandte Informatik
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              <svg className="w-3 h-3 text-purple-600 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Discrete Mathematik
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

export default SkillDetails; 