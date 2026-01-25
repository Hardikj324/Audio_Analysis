import React,{useEffect,useState} from "react";
import { getQuestions, saveQuestionResponse  } from "../api/questionsApi";
import "../style/page4.css";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../utils/storage";

const Page4 = () =>{
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);

    const userProfile = getUserProfile();
    const userId = userProfile ? userProfile.user_id : null; 
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuestions();
      }, []);

    const fetchQuestions = async () => {
        try{
            const data = await getQuestions();
            setQuestions(data);
        } catch (err) {
            alert("Failed to load questions");
          } finally {
            setLoading(false);}
    };
    const handleChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
      };
    
    const handleSubmit = async () => {
        try{
            for (const q of questions){
                await saveQuestionResponse ({
                    user: userId,
                    question: q.id,
                    rating: answers[q.id],
                  });
            }
            navigate("/perception-intro");
            alert("Responses saved successfully");
        }
        catch (err) {
            navigate("/perception-intro");
          } 
    };
    if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
return(
    <div className="page4-container">
        {questions.map((q, index) => (
            <div key={q.id} className="question-card">
                <p className="question-text">
                    {index + 1}. ) {q.text}
                </p>
                <div className="likert-row">
                <span>{q.reverse_scale ? "Agree" : "Disagree"}</span>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <label key={num}>
                        <input 
                        type="radio"
                        name={`q-${q.id}`}
                        value={num}
                        checked={answers[q.id]===num}
                        onChange={()=>handleChange(q.id,num)}
                        />

                        <span>{num}</span>
                    </label>
                ))}
                <span>{q.reverse_scale ? "Disagree" : "Agree"}</span>
                </div>
            </div>
        ))}
      <button className="next-btn" onClick={handleSubmit}>
        Next
      </button>
    </div>
)
}
export default Page4;