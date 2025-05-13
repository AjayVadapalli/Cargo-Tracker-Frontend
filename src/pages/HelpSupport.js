import React, { useState } from 'react';
import { FiHelpCircle, FiMail, FiPhone, FiMessageSquare, FiChevronDown, FiChevronUp, FiExternalLink } from 'react-icons/fi';

const HelpSupport = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: ''
  });

  const faqs = [
    {
      question: 'How do I track a shipment?',
      answer: 'To track a shipment, go to the Track Shipment page and enter your shipment ID or tracking number. You can also view all your shipments on the Dashboard and click on any shipment to see its detailed status and location.'
    },
    {
      question: 'How do I create a new shipment?',
      answer: 'To create a new shipment, click on the "Create Shipment" button in the sidebar or on the Dashboard. Fill in the required information including origin, destination, cargo details, and any special requirements. Once submitted, you\'ll receive a tracking number for your shipment.'
    },
    {
      question: 'What types of cargo can I ship?',
      answer: 'We support various types of cargo including general cargo, refrigerated goods, hazardous materials, and oversized cargo. Visit the Cargo Types page to see the complete list of supported cargo types and their specific requirements.'
    },
    {
      question: 'How do I update shipment status?',
      answer: 'Shipment status updates can be made by authorized personnel through the Fleet Management page. Select the shipment you want to update, click on "Update Status", and enter the new status information including location and any relevant notes.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept major credit cards, bank transfers, and PayPal. For corporate accounts, we also offer invoice-based payment options with net-30 terms. Contact our sales team for more information about payment options.'
    }
  ];

  const handleFaqToggle = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to submit support ticket
    alert('Support ticket submitted successfully! We will get back to you soon.');
    setTicketForm({
      subject: '',
      category: 'general',
      priority: 'medium',
      description: ''
    });
  };

  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Help & Support</h1>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center mb-4">
          <FiHelpCircle className="h-5 w-5 text-[var(--color-primary-500)] mr-2" />
          <h2 className="text-lg font-semibold">Contact Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <FiMail className="h-5 w-5 text-[var(--color-primary-500)] mr-3" />
            <div>
              <h3 className="font-medium">Email Support</h3>
              <a href="mailto:support@cargotracker.com" className="text-[var(--color-primary-600)] hover:underline">
                support@cargotracker.com
              </a>
            </div>
          </div>
          
          <div className="flex items-center">
            <FiPhone className="h-5 w-5 text-[var(--color-primary-500)] mr-3" />
            <div>
              <h3 className="font-medium">Phone Support</h3>
              <a href="tel:+1-800-CARGO-HELP" className="text-[var(--color-primary-600)] hover:underline">
                +1 (800) CARGO-HELP
              </a>
            </div>
          </div>
          
          <div className="flex items-center">
            <FiMessageSquare className="h-5 w-5 text-[var(--color-primary-500)] mr-3" />
            <div>
              <h3 className="font-medium">Live Chat</h3>
              <button className="text-[var(--color-primary-600)] hover:underline">
                Start Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-[var(--color-neutral-200)] rounded-lg">
              <button
                className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-[var(--color-neutral-50)]"
                onClick={() => handleFaqToggle(index)}
              >
                <span className="font-medium">{faq.question}</span>
                {activeFaq === index ? (
                  <FiChevronUp className="h-5 w-5 text-[var(--color-neutral-500)]" />
                ) : (
                  <FiChevronDown className="h-5 w-5 text-[var(--color-neutral-500)]" />
                )}
              </button>
              
              {activeFaq === index && (
                <div className="px-4 py-3 bg-[var(--color-neutral-50)] border-t border-[var(--color-neutral-200)]">
                  <p className="text-[var(--color-neutral-700)]">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Support Ticket Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Submit a Support Ticket</h2>
        
        <form onSubmit={handleTicketSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={ticketForm.subject}
              onChange={handleTicketChange}
              className="form-input"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={ticketForm.category}
                onChange={handleTicketChange}
                className="form-input"
              >
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="billing">Billing Issue</option>
                <option value="shipment">Shipment Problem</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                name="priority"
                value={ticketForm.priority}
                onChange={handleTicketChange}
                className="form-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={ticketForm.description}
              onChange={handleTicketChange}
              rows="4"
              className="form-input"
              required
              placeholder="Please provide detailed information about your issue..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>

      {/* Documentation Links */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Documentation & Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center w-full p-4 border border-[var(--color-neutral-200)] rounded-lg bg-[var(--color-neutral-50)]">
            <FiExternalLink className="h-5 w-5 text-[var(--color-neutral-400)] mr-3" />
            <div>
              <h3 className="font-medium text-[var(--color-neutral-600)]">User Guide</h3>
              <p className="text-sm text-[var(--color-neutral-500)]">Coming soon</p>
            </div>
          </div>
          
          <div className="flex items-center w-full p-4 border border-[var(--color-neutral-200)] rounded-lg bg-[var(--color-neutral-50)]">
            <FiExternalLink className="h-5 w-5 text-[var(--color-neutral-400)] mr-3" />
            <div>
              <h3 className="font-medium text-[var(--color-neutral-600)]">API Documentation</h3>
              <p className="text-sm text-[var(--color-neutral-500)]">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport; 