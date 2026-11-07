const members = [
  { name: 'Alanoud Almubarak', studentId: '222410346' },
  { name: 'Reema Altamimi', studentId: '222410482' },
  { name: 'Dana Alfaris', studentId: '222410460' },
]

function About() {
  return (
    <section>
      <h1>About</h1>
      <p>
        SE411 project, Fall 2026-27. This app manages the computers of a company.
        It was made by our team:
      </p>

      <table className="about-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Student ID</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.studentId}>
              <td>{m.name}</td>
              <td>{m.studentId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default About
