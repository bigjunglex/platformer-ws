export function UI() {
    return (
        <div className="ui-container" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            border: '1px solid red',
            color: 'green',
            zIndex: 1,
        }}>
            <p>its overlay</p>
        </div>
    )
}