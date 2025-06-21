import QuestionForm from "./QuestionForm"; // you'll build this next

const AdminDashboard = () => {
  return (
    <div className="flex p-4 gap-8">
      <div className="flex-1">
        <QuestionForm />
      </div>
    </div>
  );
};

export default AdminDashboard;