function MainContent({ content }) {
  return (
    <div className="main-content">
      {/* Display the content here */}
      <p>{content}</p>
      {/* If content is a list, map over it and display items */}
    </div>
  );
}
