import React, { useState, useEffect, useRef } from 'react';
import Modal from '../ui/Modal.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import Button from '../ui/Button.tsx';
import InputField from '../ui/InputField.tsx';
import { useI18n } from '../../store/i18n.tsx';
import LoadingSpinner from '../ui/LoadingSpinner.tsx';
import { Venue, Event } from '../../types/entities.ts';
import { useUpdateVenue } from '../../lib/hooks/useUpdateVenue.ts';
import { UploadIcon } from '../icons/UploadIcon.tsx';

interface EditVenueModalProps {
    isOpen: boolean;
    onClose: () => void;
    venue: Venue | Event;
}

const EditVenueModal: React.FC<EditVenueModalProps> = ({ isOpen, onClose, venue }) => {
    const { lang } = useI18n();
    const { mutate: updateVenue, isLoading: isUpdating } = useUpdateVenue();
    const [formData, setFormData] = useState<Partial<Venue & Event>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (venue) {
            const isEvent = 'dateTime' in venue;
            setFormData({
                ...venue,
                name: isEvent ? venue.titleEn : venue.name,
            });
            setImagePreview(venue.imageUrl);
        }
    }, [venue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.checked }));
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({ ...prev, imageUrl: base64String }));
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        const isEvent = 'dateTime' in venue;
        const updatedData = isEvent ? {
            ...venue,
            titleEn: formData.name || venue.titleEn,
            titleAr: `${formData.name || venue.titleEn} (AR)`,
            type: formData.type || venue.type,
            imageUrl: formData.imageUrl || venue.imageUrl,
            dateTime: formData.dateTime || venue.dateTime,
            duration: formData.duration,
            privacy: formData.privacy || venue.privacy,
            isOnline: formData.isOnline,
            link: formData.isOnline ? formData.link : undefined,
            venueName: formData.isOnline ? undefined : formData.venueName,
        } : {
            ...venue,
            name: formData.name || venue.name,
            type: formData.type || venue.type,
            address: formData.address || venue.address,
            imageUrl: formData.imageUrl || venue.imageUrl,
            openingHours: formData.openingHours,
            descriptionEn: formData.descriptionEn,
            descriptionAr: `${formData.descriptionEn} (AR)`,
        };
        updateVenue({ venueId: venue.id, data: updatedData as Venue | Event }, {
            onSuccess: onClose
        });
    };
    
    const isEvent = 'dateTime' in venue;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <BilingualText role="H1" className="!text-xl text-center mb-6">
                {lang === 'en' ? `Edit ${isEvent ? 'Event' : 'Location'}` : `تعديل ${isEvent ? 'الفعالية' : 'المكان'}`}
            </BilingualText>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                {imagePreview ? (
                    <div className="w-full aspect-video rounded-lg overflow-hidden relative group bg-slate-700">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">Change Image</button>
                    </div>
                ) : (
                    <button onClick={() => fileInputRef.current?.click()} className="w-full aspect-video border-2 border-dashed border-slate-500 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-accent hover:text-accent transition-colors">
                        <UploadIcon className="h-8 w-8" /><BilingualText>Upload Image</BilingualText>
                    </button>
                )}

                <InputField id="name" name="name" label={lang === 'en' ? 'Name / Title' : 'الاسم / العنوان'} value={formData.name || ''} onChange={handleChange} />
                <InputField id="type" name="type" label={lang === 'en' ? 'Type' : 'النوع'} value={formData.type || ''} onChange={handleChange} />

                {isEvent ? (
                    <>
                        <InputField id="dateTime" name="dateTime" label="Date & Time" type="datetime-local" value={formData.dateTime?.substring(0, 16) || ''} onChange={handleChange} />
                        <InputField id="duration" name="duration" label="Duration" value={formData.duration || ''} onChange={handleChange} />
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="isOnline" name="isOnline" checked={formData.isOnline || false} onChange={handleCheckboxChange} />
                            <label htmlFor="isOnline"><BilingualText>Online Event</BilingualText></label>
                        </div>
                        {formData.isOnline ? (
                            <InputField id="link" name="link" label="Event Link" value={formData.link || ''} onChange={handleChange} />
                        ) : (
                            <InputField id="venueName" name="venueName" label="Venue Name" value={formData.venueName || ''} onChange={handleChange} />
                        )}
                         <div className="flex items-center gap-4">
                            <BilingualText>Privacy:</BilingualText>
                            <Button variant={formData.privacy === 'public' ? 'primary' : 'ghost'} onClick={() => setFormData(p => ({...p, privacy: 'public'}))}>Public</Button>
                            <Button variant={formData.privacy === 'private' ? 'primary' : 'ghost'} onClick={() => setFormData(p => ({...p, privacy: 'private'}))}>Private</Button>
                        </div>
                    </>
                ) : (
                    <>
                        <InputField id="address" name="address" label="Address" value={formData.address || ''} onChange={handleChange} />
                        <InputField id="openingHours" name="openingHours" label="Opening Hours" value={formData.openingHours || ''} onChange={handleChange} />
                        <textarea id="descriptionEn" name="descriptionEn" placeholder="Description" value={formData.descriptionEn || ''} onChange={handleChange} rows={3} className="w-full bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-md p-2" />
                    </>
                )}
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Button variant="ghost" onClick={onClose} disabled={isUpdating}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isUpdating}>
                    {isUpdating ? <LoadingSpinner /> : 'Save Changes'}
                </Button>
            </div>
        </Modal>
    );
};

export default EditVenueModal;