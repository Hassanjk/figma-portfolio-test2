import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
// import personImage from '/assets/img/person.png';
import Projects from './pages/Projects';
import AboutMe from './pages/AboutMe';
import Contact from './pages/Contact';
import SingleProject from './pages/SingleProject';
import NavigationMenu from './components/NavigationMenu';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { useScrollStore } from './store/useScrollStore';
import './styles/singleProject.css';

gsap.registerPlugin(Observer);

function AppContent() {
  const { currentView, setCurrentView, isAnimating, setIsAnimating } = useScrollStore();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const view1Ref = useRef<HTMLDivElement>(null);
  const view2Ref = useRef<HTMLDivElement>(null);
  const view3Ref = useRef<HTMLDivElement>(null);
  const view4Ref = useRef<HTMLDivElement>(null);
  const projectViewRef = useRef<HTMLDivElement>(null);

  const handleViewTransition = (direction: 'up' | 'down', targetView: number) => {
    if (isAnimating) return;
    
    // Prevent invalid transitions
    if (currentView === 1 && targetView !== 2) return;
    if (currentView === 2 && targetView !== 1 && targetView !== 3) return;
    if (currentView === 3 && targetView !== 2 && targetView !== 4) return;
    if (currentView === 4 && targetView !== 3) return;

    setIsAnimating(true);

    const tl = gsap.timeline({
      defaults: { duration: 1.5, ease: "power2.inOut" },
      onComplete: () => setIsAnimating(false)
    });

    if (currentView === 1 && targetView === 2) {
      // Home to Projects
      tl.to(view1Ref.current, { yPercent: -100 })
        .fromTo(view2Ref.current, 
          { yPercent: 100, visibility: 'visible' },
          { yPercent: 0 },
          "<"
        )
        .add(() => setCurrentView(2));
    } else if (currentView === 2 && targetView === 1) {
      // Projects to Home
      tl.to(view2Ref.current, { yPercent: 100 })
        .fromTo(view1Ref.current,
          { yPercent: -100, visibility: 'visible' },
          { yPercent: 0 },
          "<"
        )
        .add(() => setCurrentView(1));
    } else if (currentView === 2 && targetView === 3) {
      // Projects to About
      tl.to(view2Ref.current, { yPercent: -100 })
        .fromTo(view3Ref.current,
          { yPercent: 100, visibility: 'visible' },
          { yPercent: 0 },
          "<"
        )
        .add(() => setCurrentView(3));
    } else if (currentView === 3 && targetView === 2) {
      // About to Projects
      tl.to(view3Ref.current, { yPercent: 100 })
        .fromTo(view2Ref.current,
          { yPercent: -100, visibility: 'visible' },
          { yPercent: 0 },
          "<"
        )
        .add(() => setCurrentView(2));
    } else if (currentView === 3 && targetView === 4) {
      // About to Contact
      tl.to(view3Ref.current, { yPercent: -100 })
        .fromTo(view4Ref.current,
          { yPercent: 100, visibility: 'visible' },
          { yPercent: 0 },
          "<"
        )
        .add(() => setCurrentView(4));
    } else if (currentView === 4 && targetView === 3) {
      // Contact to About
      tl.to(view4Ref.current, { yPercent: 100 })
        .fromTo(view3Ref.current,
          { yPercent: -100, visibility: 'visible' },
          { yPercent: 0 },
          "<"
        )
        .add(() => setCurrentView(3));
    }
  };

  const handleProjectSelect = (projectId: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSelectedProjectId(projectId);

    // Animate the project view in
    const tl = gsap.timeline({
      defaults: { duration: 1.5, ease: "power2.inOut" },
      onComplete: () => setIsAnimating(false)
    });

    tl.set(projectViewRef.current, { visibility: 'visible', zIndex: 100 })
      .fromTo(projectViewRef.current, 
        { xPercent: 100 },
        { xPercent: 0 }
      );
  };

  const handleReturnFromProject = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);

    const tl = gsap.timeline({
      defaults: { duration: 1.5, ease: "power2.inOut" },
      onComplete: () => {
        setIsAnimating(false);
        setSelectedProjectId(null);
      }
    });

    tl.to(projectViewRef.current, { xPercent: 100 })
      .set(projectViewRef.current, { visibility: 'hidden', zIndex: -1 });
  };

  useEffect(() => {
    // Initial setup
    gsap.set([view1Ref.current, view2Ref.current, view3Ref.current, view4Ref.current], { 
      visibility: 'visible' 
    });
    gsap.set(view1Ref.current, { yPercent: currentView === 1 ? 0 : -100 });
    gsap.set(view2Ref.current, { yPercent: currentView === 2 ? 0 : 100 });
    gsap.set(view3Ref.current, { yPercent: currentView === 3 ? 0 : 100 });
    gsap.set(view4Ref.current, { yPercent: currentView === 4 ? 0 : 100 });

    // Observer for scroll transitions - only active when not on view 2 (Projects)
    const observer = Observer.create({
      target: window,
      type: 'wheel',
      onChange: (event) => {
        if (isAnimating || currentView === 2) return; // Prevent scroll transitions on view 2
        
        const scrollingDown = event.deltaY > 0;
        
        // Updated scroll transition logic
        if (scrollingDown && currentView === 1) {
          handleViewTransition('down', 2);
        } else if (!scrollingDown && currentView === 3) {
          handleViewTransition('up', 2);
        } else if (!scrollingDown && currentView === 4) {
          handleViewTransition('up', 3);
        }
      },
      preventDefault: true
    });

    return () => {
      if (observer) observer.kill();
    };
  }, [currentView, isAnimating]);

  return (
    <div className="bg-white min-h-screen text-black overflow-hidden">
      {/* Navigation Menu */}
      <NavigationMenu onNavigate={(view) => handleViewTransition(view > currentView ? 'down' : 'up', view)} />

      {/* Views Container */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* View 1 - Home */}
        <div ref={view1Ref} className="view view--1">
          <div className="relative min-h-screen flex flex-col items-center">
            {/* Navbar */}
            <nav className="navbar-container">
              <div className="navbar">
                <div className="nav-group">
                  <a href="#" className="nav-link active">Home</a>
                  <a href="#" className="nav-link">About</a>
                  <a href="#" className="nav-link">Service</a>
                </div>
                
                <div className="logo">
                  <div className="logo-icon">JC</div>
                  JCREA
                </div>
                
                <div className="nav-group">
                  <a href="#" className="nav-link">Resume</a>
                  <a href="#" className="nav-link">Project</a>
                  <a href="#" className="nav-link">Contact</a>
                </div>
              </div>
            </nav>
            
            {/* Main Content */}
            <div className="hero-container">
              {/* Main Text and Image (Centered) */}
              <div className="hero-center">
                <div className="title-box">
                  <h1 className="hero-title text-6xl md:text-8xl text-center">
                    I'm <span className="hero-name">Jenny</span>,
                    <br />
                    Product Designer
                  </h1>
                </div>
                
                {/* Image with background */}
                <div className="hero-image-container">
                  <div className="hero-image-bg"></div>
                  <img 
                    src="/assets/img/person.png"
                    alt="Designer"
                    className="hero-image"
                  />
                </div>
              </div>
              
              {/* Testimonial (Left Side) */}
              <div className="testimonial-container">
                <div className="quote-icon">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 15H5C4.45 15 4 14.55 4 14V10C4 9.45 4.45 9 5 9H10C10.55 9 11 9.45 11 10V14C11 14.55 10.55 15 10 15ZM20 15H15C14.45 15 14 14.55 14 14V10C14 9.45 14.45 9 15 9H20C20.55 9 21 9.45 21 10V14C21 14.55 20.55 15 20 15Z" fill="#FF8A3C"/>
                  </svg>
                </div>
                <div className="testimonial">
                  <p>
                    "Jenny's Exceptional product design ensures our website's success.
                    Highly Recommended"
                  </p>
                </div>
              </div>
              
              {/* Experience Badge (Right Side) */}
              <div className="experience-container">
                <div className="experience">
                  <div className="stars">★ ★ ★ ★ ★</div>
                  <div className="years">10 Years</div>
                  <div>Experience</div>
                </div>
              </div>
            </div>
            
            {/* Call to Action Buttons (Bottom Center) */}
            <div className="action-buttons">
              <button className="btn btn-primary">
                Portfolio <ArrowRight size={16} />
              </button>
              <button className="btn btn-secondary">
                Hire me
              </button>
            </div>
            
            {/* Decorative Elements */}
            <div className="decorative-element top-left">
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 0C25 13.8071 13.8071 25 0 25" stroke="#FF8A3C" strokeWidth="2"/>
              </svg>
            </div>
            <div className="decorative-element bottom-right">
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 50C25 36.1929 36.1929 25 50 25" stroke="#FF8A3C" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </div>

        {/* View 2 - Projects */}
        <div ref={view2Ref} className="view view--2">
          <Projects 
            onNavigateBack={() => handleViewTransition('up', 1)}
            onNavigateToAbout={() => handleViewTransition('down', 3)}
            onSelectProject={handleProjectSelect}
          />
        </div>

        {/* View 3 - About Me */}
        <div ref={view3Ref} className="view view--3">
          <AboutMe 
            onNavigateBack={() => handleViewTransition('up', 2)}
            onNavigateToContact={() => handleViewTransition('down', 4)}
          />
        </div>

        {/* View 4 - Contact */}
        <div ref={view4Ref} className="view view--4">
          <Contact onNavigateBack={() => handleViewTransition('up', 3)} />
        </div>

        {/* Project Detail View */}
        <div 
          ref={projectViewRef} 
          className="view project-view"
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            visibility: 'hidden',
            zIndex: -1
          }}
        >
          {selectedProjectId !== null && (
            <SingleProject 
              projectId={selectedProjectId}
              onNavigateBack={handleReturnFromProject}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;