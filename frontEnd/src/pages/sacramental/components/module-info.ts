/**
 * Module Info Component
 * Renders module-specific content: story, fees, training schedule, agenda
 * Used by non-choir modules (Dancers, St. Francis, Charismatic)
 */

import { DOMHelpers } from '../../backend/utils/dom-helpers.js';

interface ModuleData {
    title?: string;
    description?: string;
    story?: string;
    training?: string;
    location?: string;
    scheduleLabel?: string;
    fees?: {
        registration?: string;
        subscription?: string;
        uniform?: string;
    };
    agenda?: string[];
    logoUrl?: string;
    fullImage?: string;
}

export class ModuleInfo {
    private container: HTMLElement;
    private data: ModuleData;

    constructor(containerId: string, data: ModuleData) {
        const element = document.getElementById(containerId);
        if (!element) {
            throw new Error(`Container with id "${containerId}" not found`);
        }
        this.container = element;
        this.data = data;
    }

    render(): void {
        this.container.innerHTML = '';
        this.container.className = 'csa-choir-section csa-choir-container';

        const wrapper = DOMHelpers.createElement('div', 'module-info');

        // Training / Meeting Schedule
        if (this.data.training) {
            const scheduleSection = DOMHelpers.createElement('div', 'module-info__schedule');
            const scheduleTitle = DOMHelpers.createElement('h2', 'module-info__section-title');
            scheduleTitle.textContent = this.data.scheduleLabel || 'Schedule';
            scheduleSection.appendChild(scheduleTitle);

            const scheduleCard = DOMHelpers.createElement('div', 'module-info__card');

            const timeRow = DOMHelpers.createElement('div', 'module-info__row');
            const timeIcon = DOMHelpers.createElement('span', 'module-info__icon');
            timeIcon.textContent = '🕐';
            const timeText = DOMHelpers.createElement('span', 'module-info__text');
            timeText.textContent = this.data.training;
            timeRow.appendChild(timeIcon);
            timeRow.appendChild(timeText);
            scheduleCard.appendChild(timeRow);

            if (this.data.location) {
                const locRow = DOMHelpers.createElement('div', 'module-info__row');
                const locIcon = DOMHelpers.createElement('span', 'module-info__icon');
                locIcon.textContent = '📍';
                const locText = DOMHelpers.createElement('span', 'module-info__text');
                locText.textContent = this.data.location;
                locRow.appendChild(locIcon);
                locRow.appendChild(locText);
                scheduleCard.appendChild(locRow);
            }

            scheduleSection.appendChild(scheduleCard);
            wrapper.appendChild(scheduleSection);
        }

        // Fees
        if (this.data.fees) {
            const feesSection = DOMHelpers.createElement('div', 'module-info__fees');
            const feesTitle = DOMHelpers.createElement('h2', 'module-info__section-title');
            feesTitle.textContent = 'Fees & Requirements';
            feesSection.appendChild(feesTitle);

            const feesCard = DOMHelpers.createElement('div', 'module-info__card');
            const feesList = DOMHelpers.createElement('ul', 'module-info__fees-list');

            if (this.data.fees.registration) {
                const li = DOMHelpers.createElement('li', 'module-info__fee-item');
                li.innerHTML = `<strong>Registration:</strong> ${this.data.fees.registration}`;
                feesList.appendChild(li);
            }
            if (this.data.fees.subscription) {
                const li = DOMHelpers.createElement('li', 'module-info__fee-item');
                li.innerHTML = `<strong>Subscription:</strong> ${this.data.fees.subscription}`;
                feesList.appendChild(li);
            }
            if (this.data.fees.uniform) {
                const li = DOMHelpers.createElement('li', 'module-info__fee-item');
                li.innerHTML = `<strong>Uniform:</strong> ${this.data.fees.uniform}`;
                feesList.appendChild(li);
            }

            feesCard.appendChild(feesList);
            feesSection.appendChild(feesCard);
            wrapper.appendChild(feesSection);
        }

        // Story section
        if (this.data.story) {
            const storySection = DOMHelpers.createElement('div', 'module-info__story');
            const storyTitle = DOMHelpers.createElement('h2', 'module-info__section-title');
            storyTitle.textContent = 'Our Story';
            storySection.appendChild(storyTitle);

            const storyCard = DOMHelpers.createElement('div', 'module-info__card module-info__story-content');

            if (this.data.logoUrl) {
                const img = DOMHelpers.createElement('img', 'module-info__story-image') as HTMLImageElement;
                img.src = this.data.logoUrl;
                img.alt = this.data.title || 'Module';
                storyCard.appendChild(img);
            }

            const storyContent = DOMHelpers.createElement('div', 'module-info__story-text');
            storyContent.innerHTML = this.data.story;
            storyCard.appendChild(storyContent);

            storySection.appendChild(storyCard);
            wrapper.appendChild(storySection);
        }

        // Agenda
        if (this.data.agenda && this.data.agenda.length > 0) {
            const agendaSection = DOMHelpers.createElement('div', 'module-info__agenda');
            const agendaTitle = DOMHelpers.createElement('h2', 'module-info__section-title');
            agendaTitle.textContent = 'Our Mission & Agenda';
            agendaSection.appendChild(agendaTitle);

            const agendaCard = DOMHelpers.createElement('div', 'module-info__card');
            const agendaList = DOMHelpers.createElement('ul', 'module-info__agenda-list');

            this.data.agenda.forEach(item => {
                const li = DOMHelpers.createElement('li', 'module-info__agenda-item');
                li.textContent = item;
                agendaList.appendChild(li);
            });

            agendaCard.appendChild(agendaList);
            agendaSection.appendChild(agendaCard);
            wrapper.appendChild(agendaSection);
        }

        this.container.appendChild(wrapper);
    }

    destroy(): void {
        DOMHelpers.clearElement(this.container);
    }
}
