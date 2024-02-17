import React from 'react'
import RadioButtonUnchecked from '@mui/icons-material/RadioButtonUnchecked'
import TaskAlt from '@mui/icons-material/TaskAlt'
import AddTask from '@mui/icons-material/AddTask'
import IconButton from '@mui/material/IconButton'

export default function Checkbox({ name, state, handleClaim }) {
    let icon = null
    if (state === 1)
        icon = <TaskAlt />
    else if (state === 2)
        icon = <AddTask />
    else
        icon = <RadioButtonUnchecked />

    return (
        <IconButton name={name} onClick={handleClaim}>
            {icon}
        </IconButton>

    )

}