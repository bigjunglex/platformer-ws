export function Menu() {
    return (
        <h1 style={{
                display: "flex",
                gap: '10px',
                alignItems: 'center',
            }}>
            Awaiting players... 
            <div className="spinner"></div>
        </h1>
    )
}