import React, { useState, useEffect } from 'react';
import "./courses.css"
import CourseCard from '../../components/coursecard/CourseCard';
import { CourseData } from '../../context/CourseContext';

const Courses = () => {
  const { courses } = CourseData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchBy, setSearchBy] = useState("title"); // Default search by title

  // Filter courses based on search term and search criteria
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => {
        const searchValue = searchTerm.toLowerCase();
        
        switch (searchBy) {
          case "title":
            return course.title?.toLowerCase().includes(searchValue);
          case "category":
            return course.category?.toLowerCase().includes(searchValue);
          case "createdBy":
            return course.createdBy?.toLowerCase().includes(searchValue);
          case "all":
            return (
              course.title?.toLowerCase().includes(searchValue) ||
              course.category?.toLowerCase().includes(searchValue) ||
              course.createdBy?.toLowerCase().includes(searchValue) ||
              course.description?.toLowerCase().includes(searchValue)
            );
          default:
            return course.title?.toLowerCase().includes(searchValue);
        }
      });
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses, searchBy]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  }

  const clearSearch = () => {
    setSearchTerm("");
  }

  return (
    <div className='courses'>
      <h2>Available Courses</h2>
      
      {/* Search Controls */}
      <div className="search-controls">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder={`Search courses by ${searchBy}...`}
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          
          <select
            value={searchBy}
            onChange={handleSearchByChange}
            className="search-select"
          >
            <option value="title">Title</option>
            <option value="category">Category</option>
            <option value="createdBy">Instructor</option>
            <option value="all">All Fields</option>
          </select>
          
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="clear-button"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Info */}
      <div className="search-results-info">
        {searchTerm ? (
          <span>
            Found <strong>{filteredCourses.length}</strong> course(s) 
            {searchBy === "all" ? " matching" : ` with ${searchBy} containing`} 
            "<strong>{searchTerm}</strong>"
          </span>
        ) : (
          <span>Showing all <strong>{courses.length}</strong> courses</span>
        )}
      </div>

      {/* Course Container */}
      <div className="course-container">
        {
          filteredCourses && filteredCourses.length > 0 ? 
            filteredCourses.map((e) => (
              <CourseCard key={e._id || e.id} course={e} />
            )) : 
            searchTerm ? (
              <div className="no-results">
                <p>No courses found matching your search criteria.</p>
                <p className="no-results-subtitle">
                  Try searching with different keywords or change the search filter.
                </p>
              </div>
            ) : (
              <p>No Courses Yet!</p>
            )
        }
      </div>
    </div>
  );
};

export default Courses;