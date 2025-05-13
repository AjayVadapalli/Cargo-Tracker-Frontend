import React, { useState, useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { Link } from 'react-router-dom';
import { FiChevronUp, FiChevronDown, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import moment from 'moment';

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  return (
    <div className="mb-4">
      <input
        value={globalFilter || ''}
        onChange={e => setGlobalFilter(e.target.value || undefined)}
        placeholder="Search shipments..."
        className="form-input"
      />
    </div>
  );
};

const ShipmentTable = ({ shipments, onDelete }) => {
  const [selectedShipment, setSelectedShipment] = useState(null);
  
  const data = useMemo(() => shipments, [shipments]);
  
  const columns = useMemo(() => [
    {
      Header: 'Container ID',
      accessor: 'containerId',
      Cell: ({ value, row }) => (
        <Link to={`/shipment/${row.original._id}`} className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-800)] font-medium">
          {value}
        </Link>
      )
    },
    {
      Header: 'Current Location',
      accessor: 'currentLocation.name',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => {
        let statusClass = '';
        switch (value) {
          case 'Loading':
            statusClass = 'status-loading';
            break;
          case 'In Transit':
            statusClass = 'status-in-transit';
            break;
          case 'Delivered':
            statusClass = 'status-delivered';
            break;
          case 'Delayed':
            statusClass = 'status-delayed';
            break;
          default:
            statusClass = 'status-loading';
        }
        return <span className={`shipment-status ${statusClass}`}>{value}</span>;
      }
    },
    {
      Header: 'Departure',
      accessor: 'departureDate',
      Cell: ({ value }) => moment(value).format('MMM D, YYYY')
    },
    {
      Header: 'Estimated Arrival',
      accessor: 'estimatedArrival',
      Cell: ({ value }) => moment(value).format('MMM D, YYYY')
    },
    {
      Header: 'Cargo Type',
      accessor: 'cargo.type',
    },
    {
      Header: 'Actions',
      id: 'actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link 
            to={`/shipment/${row.original._id}`}
            className="p-1 text-[var(--color-neutral-600)] hover:text-[var(--color-primary-500)]"
            title="View Details"
          >
            <FiEye />
          </Link>
          <Link 
            to={`/shipment/${row.original._id}/edit`}
            className="p-1 text-[var(--color-neutral-600)] hover:text-[var(--color-primary-500)]"
            title="Edit Shipment"
          >
            <FiEdit2 />
          </Link>
          <button 
            onClick={() => setSelectedShipment(row.original)}
            className="p-1 text-[var(--color-neutral-600)] hover:text-[var(--color-error-500)]"
            title="Delete Shipment"
          >
            <FiTrash2 />
          </button>
        </div>
      )
    }
  ], []);
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  } = useTable(
    { columns, data },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  
  // Delete confirmation modal
  const DeleteConfirmationModal = () => {
    if (!selectedShipment) return null;
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" onClick={() => setSelectedShipment(null)}></div>
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <FiTrash2 className="h-6 w-6 text-[var(--color-error-500)]" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-[var(--color-neutral-900)]">
                    Delete Shipment
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-[var(--color-neutral-600)]">
                      Are you sure you want to delete the shipment with container ID "{selectedShipment.containerId}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[var(--color-neutral-50)] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="btn btn-error sm:ml-3 sm:w-auto"
                onClick={() => {
                  onDelete(selectedShipment._id);
                  setSelectedShipment(null);
                }}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn border border-[var(--color-neutral-300)] bg-white text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)] mt-3 sm:mt-0 sm:w-auto"
                onClick={() => setSelectedShipment(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <GlobalFilter 
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      
      <div className="table-container">
        <table {...getTableProps()} className="table">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <div className="flex items-center">
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <FiChevronDown className="ml-1 h-4 w-4" />
                          ) : (
                            <FiChevronUp className="ml-1 h-4 w-4" />
                          )
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-[var(--color-neutral-50)]">
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className={`btn ${!canPreviousPage ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className={`btn ${!canNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next
          </button>
        </div>
        
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center">
            <span className="text-sm text-[var(--color-neutral-700)]">
              Page{' '}
              <span className="font-medium">{state.pageIndex + 1}</span> of{' '}
              <span className="font-medium">{pageOptions.length}</span>
            </span>
            <select
              value={state.pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
              className="ml-2 form-input py-1 px-2"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-[var(--color-neutral-300)] bg-white text-sm font-medium text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]"
              >
                First
              </button>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="relative inline-flex items-center px-2 py-2 border border-[var(--color-neutral-300)] bg-white text-sm font-medium text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]"
              >
                Previous
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="relative inline-flex items-center px-2 py-2 border border-[var(--color-neutral-300)] bg-white text-sm font-medium text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]"
              >
                Next
              </button>
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-[var(--color-neutral-300)] bg-white text-sm font-medium text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]"
              >
                Last
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal />
    </div>
  );
};

export default ShipmentTable;