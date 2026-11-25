function Profile() {
  const student = {
    name: "Vyshnavi Aalla",
    rollNo: "25CS2101",
    department: "Computer Science and Engineering",
    year: "2nd Year",
    email: "vyshnaviaalla@gmail.com",
    phone: "9876543210",
  };

  return (
    <div className="page-container">
      <div className="profile-card">
        <h1>Student Profile</h1>

        <p>
          <strong>Name:</strong> {student.name}
        </p>

        <p>
          <strong>Roll Number:</strong> {student.rollNo}
        </p>

        <p>
          <strong>Department:</strong> {student.department}
        </p>

        <p>
          <strong>Year:</strong> {student.year}
        </p>

        <p>
          <strong>Email:</strong> {student.email}
        </p>

        <p>
          <strong>Phone:</strong> {student.phone}
        </p>
      </div>
    </div>
  );
}

export default Profile;