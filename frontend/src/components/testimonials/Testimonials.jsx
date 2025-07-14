import React from 'react'
import "./testimonials.css"
const Testimonial = () => {
const testimonialsData = [
  {
    id: 1,
    name: "Aarav Mehta",
    position: "Engineering Student",
    message:
      "The platform made complex topics easy to grasp. The visual explanations and real-world projects are simply excellent.",
    image:
      "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Sanya Kapoor",
    position: "Medical Aspirant",
    message:
      "I love the structured courses and doubt sessions. It helped me stay on track during my NEET prep.",
    image:
      "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Ritik Sharma",
    position: "BCA Student",
    message:
      "The interactive coding playground and regular quizzes kept me engaged throughout the course.",
    image:
      "https://randomuser.me/api/portraits/men/76.jpg",
  },
  {
    id: 4,
    name: "Priya Das",
    position: "UPSC Aspirant",
    message:
      "The in-depth video lectures and quality notes helped me build a solid foundation for prelims and mains.",
    image:
      "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 5,
    name: "Kabir Nair",
    position: "Commerce Student",
    message:
      "This platform explains business concepts better than any tuition I’ve attended. Highly recommended!",
    image:
      "https://randomuser.me/api/portraits/men/22.jpg",
  },
];


  return (
    
    <section className='testimonial' >
        <div className="testimonial-cards">
         {
            testimonialsData.map((e)=> 
        (
            <div className="testimonial-card" key={e.id}>
               <div className="student-image">
                <img src={e.image} alt={e.name} />
               </div>
                <p className="message">{e.message}</p>
                <div className="info">
                    <h3>{e.name}</h3>
                    <p>{e.position}</p>
                </div>
            </div>
        )

            )}
        </div>
    </section>
    
  )
}

export default Testimonial
