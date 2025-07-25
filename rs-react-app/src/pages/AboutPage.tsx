const AboutPage = () => (
  <div className="container mx-auto mt-5 px-4">
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 shadow-2xl rounded-3xl p-8 text-white text-center relative overflow-hidden z-50">
        {/* Wave effects */}
        <div className="absolute w-[150%] h-[500%] opacity-60 left-0 top-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-[40%] animate-spin [animation-duration:15s] -z-10"></div>
        <div className="absolute w-[150%] h-[500%] opacity-60 left-0 top-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-[40%] animate-spin [animation-duration:15s] delay-100 -z-10"></div>
        <div className="absolute w-[150%] h-[500%] opacity-60 left-0 top-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-[40%] animate-spin [animation-duration:15s] delay-200 -z-10"></div>

        <h1 className="text-4xl font-bold mb-6 mt-2 z-50">Sobre mí</h1>

        <div className="space-y-4 bg-transparent z-50">
          <h2 className="text-2xl font-semibold text-white break-words z-50">
            Kathering Rivera Rodriguez
          </h2>
          <p className="text-lg text-indigo-100 break-words z-50">
            Desarrolladora Front-End / Diseñadora UX/UI
          </p>

          <div className="flex justify-center gap-4 mt-6 text-lg flex-wrap z-50">
            <a
              href="mailto:katheriverar@gmail.com"
              className="z-50 text-white hover:text-indigo-200 transition-colors duration-200 underline"
            >
              Email
            </a>
            <a
              href="https://github.com/kattrr"
              target="_blank"
              rel="noopener noreferrer"
              className="z-50 text-white hover:text-indigo-200 transition-colors duration-200 underline"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/katheringriverar/"
              target="_blank"
              rel="noopener noreferrer"
              className="z-50 text-white hover:text-indigo-200 transition-colors duration-200 underline"
            >
              LinkedIn
            </a>
            <a
              href="https://www.behance.net/katherivera"
              target="_blank"
              rel="noopener noreferrer"
              className="z-50 text-white hover:text-indigo-200 transition-colors duration-200 underline"
            >
              Behance
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline text-lg font-medium transition-colors duration-200"
        >
          RS School React Course
        </a>
      </div>
    </div>
  </div>
);

export default AboutPage;
