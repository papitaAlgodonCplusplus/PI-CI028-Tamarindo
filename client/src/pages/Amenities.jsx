/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import '../amenities_page_styles.scss';
import axios from "axios";
import { AuthContext } from '../AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { emptyContainer, updateContainer, showErrorDialog, postDataWithTimeout, deleteDataWithTimeout } from '../Misc';

const Amenities = () => {
    return (
        <div className='body'>
            Hello this is Amenities;
        </div >
    )
}
export default Amenities;