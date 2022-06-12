import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {
    render() {
        return (
            <div className="TrackList">
                {
                    this.props.tracks.map(track => {
                        return <Track
                            isRemoval={this.props.isRemoval}
                            onRemove={this.props.onRemove}
                            onAdd={this.props.onAdd}
                            key={track.id}
                            track={track} />
                    })
                }
            </div>
        )
    }
}

export default TrackList;