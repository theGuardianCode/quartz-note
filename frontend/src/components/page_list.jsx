import { useState } from 'preact/hooks';
import { supabase } from '../../connection';
import { v4 as uuidv4 } from 'uuid';
import './page_list.css';

export function PageList({pages, changePage, setShowModal}) {
    function toggleModal() {
        setShowModal(true);
    }

    return (
        <div class="page-list">
            <span id="note-buttons"><button onClick={toggleModal}>New Note +</button></span>
            <ul>
                {pages.map(page => (
                    <span style="display: flex; align-items: center;">
                        <li onClick={() => changePage(page.id, page.name)}>{page.name}</li><button>&#8942;</button>
                    </span>
                ))}
            </ul>
        </div>
    );
}