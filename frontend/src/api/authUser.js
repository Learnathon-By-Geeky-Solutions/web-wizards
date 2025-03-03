export const registerUser = async (data) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  };

export const loginUser = async (data) => {
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         

        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
};

export const forgotPassword = async (email) => {
  const response = await fetch('http://127.0.0.1:8000/api/users/forgot-password/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
    });

    if (!response.ok) 
    {
      throw new Error('Failed to send reset email. Please try again.');
    }

    return response.json();
};


export const getUserProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://127.0.0.1:8000/api/users/profile/', {
        method: 'GET',
        headers:
        {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
      });

      if (!response.ok) 
      {
        throw new Error('Failed to fetch user profile');
      }

      return await response.json();
      } catch (error) {
        throw error;
      }
};

