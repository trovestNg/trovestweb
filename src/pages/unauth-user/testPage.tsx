import React, { useState, useEffect } from 'react';

// Example user data
const users = [
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' },
  { id: 3, name: 'User 3' },
];

const fetchUserData = (userId:any) => {
  // Mock function to simulate data fetching
  return { id: userId, name: `User ${userId}`, children: [{ id: userId + 1, name: `User ${userId + 1}` }] };
};

const UserPage = () => {
  const [allPaths, setAllPaths] = useState<any>([]);
  const [currentPath, setCurrentPath] = useState<any>([]);
  const [currentUserData, setCurrentUserData] = useState<any>(null);

  // Fetch user data when the path changes
  useEffect(() => {
    if (currentPath.length > 0) {
      const userId = currentPath[currentPath.length - 1];
      const data = fetchUserData(userId);
      setCurrentUserData(data);
    }
  }, [currentPath]);

  // Handle click on user in the upper user list
  const handleUserClick = (user:any) => {
    const newPath = [user.id];
    setCurrentPath(newPath);
    setAllPaths([newPath]); // Start a fresh set of paths
  };

  // Handle click on a child user
  const handleChildUserClick = (child:any) => {
    const newPath = [...currentPath, child.id];
    setCurrentPath(newPath);
    setAllPaths((prevPaths:any) => [...prevPaths, newPath]); // Add new path to the list of paths
  };

  // Handle click on any path segment
  const handlePathSegmentClick = (pathIndex:any, segmentIndex:any) => {
    const clickedPath = allPaths[pathIndex].slice(0, segmentIndex + 1);
    setCurrentPath(clickedPath);
    setAllPaths((prevPaths:any) => {
      const updatedPaths = prevPaths.slice(0, pathIndex + 1);
      updatedPaths[pathIndex] = clickedPath;
      return updatedPaths;
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>User List</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} onClick={() => handleUserClick(user)} style={{ cursor: 'pointer' }}>
              {user.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Path List (Current Depth: Level {currentPath.length})</h2>
        {allPaths.map((path:any, pathIndex:any) => (
          <ul key={pathIndex} style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
            {path.map((id:any, segmentIndex:any) => (
              <li
                key={id}
                onClick={() => handlePathSegmentClick(pathIndex, segmentIndex)}
                style={{
                  marginRight: '10px',
                  cursor: segmentIndex === path.length - 1 ? 'default' : 'pointer',
                  border: '1px solid #ccc',
                  padding: '5px',
                  backgroundColor: segmentIndex === path.length - 1 ? '#ddd' : '#fff',
                }}
              >
                User {id}
              </li>
            ))}
          </ul>
        ))}
      </div>

      <div>
        <h2>Current User Data</h2>
        {currentUserData ? (
          <div>
            <p>ID: {currentUserData.id}</p>
            <p>Name: {currentUserData.name}</p>
            <h3>Children:</h3>
            <ul>
              {currentUserData.children.map((child:any) => (
                <li key={child.id} onClick={() => handleChildUserClick(child)} style={{ cursor: 'pointer' }}>
                  {child.name}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No user selected</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;
