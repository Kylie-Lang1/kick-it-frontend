import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserProvider'
import axios from 'axios'

const API = process.env.REACT_APP_API_URL

export default function User({ users }) {
  const navigate = useNavigate();

  const { user } = useUser();
  const [request, setRequest] = useState(null);
  const [friends, setFriends] = useState(false);

  function sendFriendRequest() {
    axios.post(`${API}/friends`, { users_id: users?.id, senders_id: user?.id })
      .then(() => {
        setRequest(true); // Update request state to indicate that the request was sent
      });
  }

  useEffect(() => {
    if (user?.id) {
      axios.get(`${API}/friends/${users?.id}/request?id=${user?.id}`)
        .then((res) => {
          setRequest(res.data[0]);
        });
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      axios.get(`${API}/friends/${users?.id}/list?id=${user?.id}`)
        .then((res) => {
          setFriends(res.data[0]);
        });
    }
  }, [user?.id]);

  return (
    <div className='bg-cyan-100 shadow-lg p-4 rounded-md flex justify-between'>
      <div>
        <img src={users?.profile_img} alt={`${users?.first_name} profile image`} style={{ height: "80px", width: "60px" }}></img>
        <div>
          <h3>{users?.first_name}{" "}{users?.last_name}</h3>
          <h3 className='text-cyan-400 font-bold'>@{users?.username}</h3>
        </div>
      </div>
      <button onClick={() => navigate('/chats')} className='border-2 border-cyan-400 px-2 my-4 rounded-md'>
        <Link to='/chats'>Message</Link>
      </button>
      {user?.id === users?.id ? null : (
        friends ? (
          <span>Already Friends</span>
        ) : (
            request ? (
              <span>Friend Request Sent</span>
            ) : (
                <button className='border-2 border-cyan-400 px-2 my-4 rounded-md' onClick={sendFriendRequest}>
                  Friend Request
                </button>
              )
          )
      )}

    </div>
  )
}