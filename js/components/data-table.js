(function() {
    'use strict';

    const DataTable = {
        render: function({ columns, data, sortable = true, hoverable = true, striped = true, pagination = false, pageSize = 10, emptyMessage = 'No data available' }) {
            if (!data || data.length === 0) {
                return `
                    <div class="empty-state p-4 text-center text-muted">
                        <div class="empty-state__text">${emptyMessage}</div>
                    </div>
                `;
            }

            let tableClasses = ['data-table'];
            if (hoverable) tableClasses.push('data-table--hoverable');
            if (striped) tableClasses.push('data-table--striped');

            let html = `<div class="table-responsive"><table class="${tableClasses.join(' ')}">`;
            
            // Header
            html += `<thead><tr>`;
            columns.forEach(col => {
                const alignClass = col.align ? `text-${col.align}` : 'text-left';
                const sortAttr = sortable && col.sortable !== false ? 'data-sortable="true"' : '';
                const widthStyle = col.width ? `style="width: ${col.width}"` : '';
                html += `<th class="${alignClass}" ${sortAttr} data-key="${col.key}" ${widthStyle}>
                    ${col.label}
                    ${sortable && col.sortable !== false ? '<span class="sort-icon"></span>' : ''}
                </th>`;
            });
            html += `</tr></thead>`;

            // Body
            html += `<tbody>`;
            const displayData = pagination ? data.slice(0, pageSize) : data;
            displayData.forEach(row => {
                html += `<tr>`;
                columns.forEach(col => {
                    const alignClass = col.align ? `text-${col.align}` : 'text-left';
                    let cellValue = row[col.key];
                    
                    if (col.render) {
                        cellValue = col.render(cellValue, row);
                    } else if (col.type === 'currency' && window.Nirvana && window.Nirvana.Utils && window.Nirvana.Utils.Currency) {
                        cellValue = window.Nirvana.Utils.Currency.format(cellValue);
                    } else if (col.type === 'percentage') {
                        cellValue = `${cellValue}%`;
                    } else if (col.type === 'badge') {
                        const statusClass = cellValue === 'Active' ? 'badge--success' : cellValue === 'Pending' ? 'badge--warning' : 'badge--info';
                        cellValue = `<span class="badge ${statusClass}">${cellValue}</span>`;
                    }
                    
                    html += `<td class="${alignClass}" data-label="${col.label}">${cellValue}</td>`;
                });
                html += `</tr>`;
            });
            html += `</tbody></table></div>`;

            // Pagination
            if (pagination && data.length > pageSize) {
                const totalPages = Math.ceil(data.length / pageSize);
                html += `
                    <div class="pagination flex justify-between items-center mt-4">
                        <button class="btn btn--sm btn--secondary pagination-prev" disabled>Previous</button>
                        <span class="text-sm text-secondary">Page <span class="current-page">1</span> of ${totalPages}</span>
                        <button class="btn btn--sm btn--secondary pagination-next">Next</button>
                    </div>
                `;
            }

            return html;
        },

        create: function(containerId, config) {
            const container = document.getElementById(containerId);
            if (!container) return;

            let currentData = [...config.data];
            let currentPage = 1;
            const pageSize = config.pageSize || 10;
            let sortKey = null;
            let sortAsc = true;

            const renderTable = () => {
                const startIdx = (currentPage - 1) * pageSize;
                const pagedConfig = { ...config, data: currentData };
                
                // Keep the whole data, but if paginated, handle in render or slice here
                // We'll let render handle it for first page, but need custom here for interactions
                
                // Actually, let's manually slice here since render uses first slice
                let slicedData = config.pagination ? currentData.slice(startIdx, startIdx + pageSize) : currentData;
                
                // Override config data temporarily
                const renderConfig = { ...config, data: slicedData, pagination: false }; 
                
                let html = this.render(renderConfig);
                
                if (config.pagination && currentData.length > pageSize) {
                    const totalPages = Math.ceil(currentData.length / pageSize);
                    html += `
                        <div class="pagination flex justify-between items-center mt-4">
                            <button class="btn btn--sm btn--secondary pagination-prev" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
                            <span class="text-sm text-secondary">Page <span class="current-page">${currentPage}</span> of ${totalPages}</span>
                            <button class="btn btn--sm btn--secondary pagination-next" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
                        </div>
                    `;
                }
                
                container.innerHTML = html;

                // Setup row clicks
                if (config.onRowClick) {
                    const rows = container.querySelectorAll('tbody tr');
                    rows.forEach((row, idx) => {
                        row.style.cursor = 'pointer';
                        row.addEventListener('click', () => {
                            config.onRowClick(slicedData[idx]);
                        });
                    });
                }

                // Setup Sort
                if (config.sortable !== false) {
                    const headers = container.querySelectorAll('th[data-sortable="true"]');
                    headers.forEach(th => {
                        const key = th.getAttribute('data-key');
                        if (key === sortKey) {
                            th.classList.add(sortAsc ? 'sorted-asc' : 'sorted-desc');
                        }
                        
                        th.addEventListener('click', () => {
                            if (sortKey === key) {
                                if (sortAsc) { sortAsc = false; }
                                else { sortKey = null; sortAsc = true; } // tri-state
                            } else {
                                sortKey = key;
                                sortAsc = true;
                            }
                            
                            if (sortKey) {
                                currentData.sort((a, b) => {
                                    let valA = a[sortKey];
                                    let valB = b[sortKey];
                                    if (typeof valA === 'string') valA = valA.toLowerCase();
                                    if (typeof valB === 'string') valB = valB.toLowerCase();
                                    if (valA < valB) return sortAsc ? -1 : 1;
                                    if (valA > valB) return sortAsc ? 1 : -1;
                                    return 0;
                                });
                            } else {
                                currentData = [...config.data];
                            }
                            currentPage = 1;
                            renderTable();
                        });
                    });
                }

                // Setup Pagination Events
                if (config.pagination) {
                    const prevBtn = container.querySelector('.pagination-prev');
                    const nextBtn = container.querySelector('.pagination-next');
                    if (prevBtn) {
                        prevBtn.addEventListener('click', () => {
                            if (currentPage > 1) {
                                currentPage--;
                                renderTable();
                            }
                        });
                    }
                    if (nextBtn) {
                        nextBtn.addEventListener('click', () => {
                            const totalPages = Math.ceil(currentData.length / pageSize);
                            if (currentPage < totalPages) {
                                currentPage++;
                                renderTable();
                            }
                        });
                    }
                }
            };

            renderTable();
        }
    };

    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Components = window.Nirvana.Components || {};
    window.Nirvana.Components.DataTable = DataTable;
})();
