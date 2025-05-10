import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
    const fieldTypes = [
        {type: 'text', label: 'Text'},
        {type: 'email', label: 'Email'},
        {type: 'number', label: 'Number'},
        {type: 'date', label: 'Date'}
    ]

    return (
        <div className="sidebar">
            <h3>Enabled fields</h3>
            <div className="field-list">
                {fieldTypes.map((field) => {
                    <div
                        key={field.type}
                        className="field-item"
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData('field-type', field.type)
                            e.dataTransfer.setData('field-type', field.label)
                        }}
                    >
                        {field.label}
                    </div>
                })}
            </div>
        </div>
    );
};

export default Sidebar;