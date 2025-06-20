import React, { useState, useEffect, useCallback } from 'react';

// --- Component biểu tượng (sử dụng SVG nội tuyến để dễ di chuyển) ---
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const LoaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);

const AlertTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

const EyeIcon = ({ onClick }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={onClick}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const EyeOffIcon = ({ onClick }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={onClick}>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.54 18.54 0 0 1 2.92-5.06M2.92 2.92L21.08 21.08"></path>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
    </svg>
);

// --- Component Popup chi tiết ---
const DetailPopup = ({ item, onClose, formatHScode, highlightKeywords, keywordSearchTerm, hscodeSearchTerm, getMappedValue }) => {
    if (!item) return null;

    // Kết hợp cả hai từ khóa tìm kiếm để làm nổi bật trong popup
    const combinedSearchTerm = `${keywordSearchTerm || ''},${hscodeSearchTerm || ''}`;

    // Hàm định dạng ngày tháng sangYYYY-MM-dd
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch (e) {
            console.error("Lỗi định dạng ngày:", e);
            return dateString; // Trả về chuỗi gốc nếu định dạng thất bại
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md md:max-w-lg lg:max-w-xl relative max-h-[66vh] flex flex-col"> {/* Đã thêm max-h và flex-col */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-normal" // Changed font-bold to font-normal
                >
                    &times;
                </button>
                <h2 className="text-2xl font-normal text-slate-800 mb-4 border-b pb-2">Thông tin chi tiết</h2> {/* Changed font-bold to font-normal */}
                <div className="space-y-3 text-lg overflow-y-auto pb-4"> {/* Đã thêm overflow-y-auto và pb-4 cho cuộn */}
                    <p>
                        <strong>Mã số HS:</strong>{' '}
                        <span className="font-mono text-darkred-700 text-xl font-normal" dangerouslySetInnerHTML={{ __html: highlightKeywords(formatHScode(item.HScode), combinedSearchTerm) }}></span> {/* Changed font-bold to font-normal */}
                    </p>
                    <p>
                        <strong>Số văn bản:</strong>{' '}
                        <span dangerouslySetInnerHTML={{ __html: highlightKeywords(item.IssuedNumber, combinedSearchTerm) }}></span>
                    </p>
                    <p>
                        <strong>Ngày ban hành:</strong> {formatDate(item.IssuedDate)}
                    </p>
                    <p>
                        <strong>Mô tả hàng hóa:</strong>{' '}
                        <span dangerouslySetInnerHTML={{ __html: highlightKeywords(item.Description, combinedSearchTerm) }}></span>
                    </p>
                    <p>
                        <strong>Tóm tắt thông tin:</strong>{' '}
                        <span dangerouslySetInnerHTML={{ __html: highlightKeywords(item.Summary, combinedSearchTerm) }}></span>
                    </p>
                    {item.IssuedOffice && (
                        <p>
                            <strong>Đơn vị ban hành:</strong> {getMappedValue(item.IssuedOffice)}
                        </p>
                    )}
                    {item.DocType && (
                        <p>
                            <strong>Loại văn bản:</strong> {getMappedValue(item.DocType)}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Component Popup Đặt lại mật khẩu (Forgot Password) ---
const ForgotPasswordPopup = ({ onClose, supabaseClient }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        setIsSending(true);

        if (!email.trim()) {
            setError('Vui lòng nhập địa chỉ email của bạn.');
            setIsSending(false);
            return;
        }

        try {
            const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/`, // Redirect back to the app's origin after email click
            });

            if (resetError) {
                setError(`Lỗi: ${resetError.message}`);
            } else {
                setMessage('Nếu tài khoản của bạn tồn tại, một liên kết đặt lại mật khẩu đã được gửi đến email của bạn.');
                setEmail(''); // Clear email input
            }
        } catch (err) {
            console.error('Lỗi ngoại lệ khi đặt lại mật khẩu:', err);
            setError(`Đã xảy ra lỗi không mong muốn: ${err.message}`);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-normal"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-normal text-slate-800 mb-4 border-b pb-2 text-center">Quên mật khẩu?</h2>
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                        <label htmlFor="resetEmail" className="sr-only">Địa chỉ email</label>
                        <input
                            id="resetEmail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập địa chỉ email của bạn"
                            className="w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            autoComplete="email"
                        />
                    </div>
                    {message && (
                        <div className="text-green-600 text-sm text-center">{message}</div>
                    )}
                    {error && (
                        <div className="text-red-600 text-sm text-center">{error}</div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-red-700 hover:bg-red-800 text-white font-normal py-3 px-4 rounded-md shadow-md flex items-center justify-center transition-colors disabled:opacity-50"
                        disabled={isSending}
                    >
                        {isSending ? <LoaderIcon className="mr-2" /> : null}
                        Gửi liên kết đặt lại
                    </button>
                </form>
            </div>
        </div>
    );
};


// --- Component Popup đăng nhập ---
const LoginPopup = ({ onClose, onLoginSuccess, supabaseClient, onForgotPasswordClick }) => { // Thêm onForgotPasswordClick prop
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Trạng thái cho hiện/ẩn mật khẩu

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError(null);
        setIsLoggingIn(true);

        if (!email || !password) {
            setLoginError('Vui lòng nhập tài khoản và mật khẩu.');
            setIsLoggingIn(false);
            return;
        }

        try {
            // Sử dụng signInWithPassword để đăng nhập
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                // Xử lý lỗi cụ thể từ Supabase
                if (error.message.includes("Invalid login credentials")) {
                    setLoginError("Tài khoản hoặc mật khẩu không đúng.");
                } else {
                    setLoginError(`Lỗi đăng nhập: ${error.message}`);
                }
            } else if (data && data.user) {
                console.log('Đăng nhập thành công:', data.user);
                onLoginSuccess(data.user); // Truyền thông tin user về component cha
                onClose(); // Đóng popup
            } else {
                setLoginError("Đăng nhập thất bại. Vui lòng thử lại.");
            }
        } catch (err) {
            console.error('Lỗi ngoại lệ khi đăng nhập:', err);
            setLoginError(`Đã xảy ra lỗi không mong muốn: ${err.message}`);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-normal" // Changed font-bold to font-normal
                >
                    &times;
                </button>
                <h2 className="text-2xl font-normal text-slate-800 mb-4 border-b pb-2 text-center">Đăng nhập</h2> {/* Changed font-bold to font-normal */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="loginEmail" className="sr-only">Tài khoản hoặc địa chỉ email</label>
                        <input
                            id="loginEmail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Tài khoản hoặc địa chỉ email"
                            className="w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            autoComplete="username"
                        />
                    </div>
                    <div className="relative"> {/* Thêm relative cho icon */}
                        <label htmlFor="loginPassword" className="sr-only">Mật khẩu của bạn</label>
                        <input
                            id="loginPassword"
                            type={showPassword ? 'text' : 'password'} // Thay đổi type dựa trên trạng thái
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mật khẩu của bạn"
                            className="w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10" // Tăng padding-right cho icon
                            autoComplete="current-password"
                        />
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            {showPassword ? (
                                <EyeIcon onClick={() => setShowPassword(false)} />
                            ) : (
                                <EyeOffIcon onClick={() => setShowPassword(true)} />
                            )}
                        </span>
                    </div>
                    {loginError && (
                        <div className="text-red-600 text-sm text-center">{loginError}</div>
                    )}
                    <a href="#" onClick={onForgotPasswordClick} className="block text-right text-sm text-indigo-600 hover:underline font-normal">Quên mật khẩu?</a> {/* Changed font-bold to font-normal */}
                    <button
                        type="submit"
                        className="w-full bg-red-700 hover:bg-red-800 text-white font-normal py-3 px-4 rounded-md shadow-md flex items-center justify-center transition-colors disabled:opacity-50" // Changed font-bold to font-normal
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? <LoaderIcon className="mr-2" /> : null}
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Component Popup Tài khoản ---
const AccountPopup = ({ onClose, currentUser, supabaseClient, onUpdateUser }) => {
    const [displayName, setDisplayName] = useState(currentUser?.user_metadata?.display_name || currentUser?.email || '');
    const [currentPassword, setCurrentPassword] = useState(''); // New state for current password
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [displayNameError, setDisplayNameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [isUpdatingDisplayName, setIsUpdatingDisplayName] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false); // New state for current password visibility
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [updateSuccessMessage, setUpdateSuccessMessage] = useState(null);

    const handleUpdateDisplayName = async (e) => {
        e.preventDefault();
        setDisplayNameError(null);
        setUpdateSuccessMessage(null);
        setIsUpdatingDisplayName(true);

        try {
            const { data, error } = await supabaseClient.auth.updateUser({ 
                data: { display_name: displayName } 
            });

            if (error) {
                setDisplayNameError(`Lỗi cập nhật tên hiển thị: ${error.message}`);
            } else {
                setUpdateSuccessMessage('Cập nhật tên hiển thị thành công!');
                onUpdateUser(data.user); // Cập nhật lại thông tin user trong App.js
            }
        } catch (err) {
            console.error('Lỗi ngoại lệ khi cập nhật tên hiển thị:', err);
            setDisplayNameError(`Đã xảy ra lỗi không mong muốn: ${err.message}`);
        } finally {
            setIsUpdatingDisplayName(false);
            setTimeout(() => setUpdateSuccessMessage(null), 3000); // Clear message after 3 seconds
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setPasswordError(null);
        setUpdateSuccessMessage(null);
        setIsUpdatingPassword(true);

        // Basic client-side validation for password fields
        if (!currentPassword.trim()) {
            setPasswordError('Vui lòng nhập mật khẩu hiện tại.');
            setIsUpdatingPassword(false);
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
            setIsUpdatingPassword(false);
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            setIsUpdatingPassword(false);
            return;
        }

        try {
            // Note: Supabase's auth.updateUser does NOT take 'current_password' directly.
            // Password verification for updating the password is typically handled by Supabase itself based on the active session.
            // If stricter re-authentication is required, it often needs a separate sign-in step or a more complex RLS policy.
            // For now, the 'currentPassword' input is for UX/security best practice, but not directly used in the API call.

            const { data, error } = await supabaseClient.auth.updateUser({
                password: newPassword
            });

            if (error) {
                // If Supabase requires re-authentication, this error might guide the user.
                // For example, "AuthApiError: New password must be different from the old password."
                // Or "AuthApiError: Invalid credentials" if re-authentication is needed prior.
                setPasswordError(`Lỗi cập nhật mật khẩu: ${error.message}`);
            } else {
                setUpdateSuccessMessage('Cập nhật mật khẩu thành công! Vui lòng đăng nhập lại với mật khẩu mới.');
                setCurrentPassword(''); // Clear current password field
                setNewPassword('');
                setConfirmNewPassword('');
                // Kích hoạt đăng xuất để người dùng đăng nhập lại với mật khẩu mới
                await supabaseClient.auth.signOut();
                onClose(); // Đóng popup
            }
        } catch (err) {
            console.error('Lỗi ngoại lệ khi cập nhật mật khẩu:', err);
            setPasswordError(`Đã xảy ra lỗi không mong muốn: ${err.message}`);
        } finally {
            setIsUpdatingPassword(false);
            setTimeout(() => setUpdateSuccessMessage(null), 3000); // Clear message after 3 seconds
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-normal" // Changed font-bold to font-normal
                >
                    &times;
                </button>
                <h2 className="text-2xl font-normal text-slate-800 mb-4 border-b pb-2 text-center">Cài đặt tài khoản</h2> {/* Changed font-bold to font-normal */}

                {updateSuccessMessage && (
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md mb-4 text-center">
                        {updateSuccessMessage}
                    </div>
                )}

                {/* Phần 1: Cập nhật Display Name */}
                <div className="mb-6 pb-4 border-b">
                    <h3 className="text-xl font-normal text-slate-700 mb-3">Cập nhật tên hiển thị</h3> {/* Changed font-semibold to font-normal */}
                    <form onSubmit={handleUpdateDisplayName} className="space-y-3">
                        <div>
                            <label htmlFor="displayName" className="sr-only">Tên hiển thị</label>
                            <input
                                id="displayName"
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Tên hiển thị của bạn"
                                className="w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        {displayNameError && (
                            <div className="text-red-600 text-sm text-center">{displayNameError}</div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-red-700 hover:bg-red-800 text-white font-normal py-2 px-4 rounded-md shadow-md flex items-center justify-center transition-colors disabled:opacity-50" // Changed bg-blue-600 to bg-red-700, hover:bg-blue-700 to hover:bg-red-800, font-bold to font-normal
                            disabled={isUpdatingDisplayName}
                        >
                            {isUpdatingDisplayName ? <LoaderIcon className="mr-2" /> : null}
                            Lưu tên hiển thị
                        </button>
                    </form>
                </div>

                {/* Phần 2: Cập nhật Password */}
                <div>
                    <h3 className="text-xl font-normal text-slate-700 mb-3">Cập nhật mật khẩu</h3> {/* Changed font-semibold to font-normal */}
                    <form onSubmit={handleUpdatePassword} className="space-y-3">
                        <div className="relative"> {/* New input for current password */}
                            <label htmlFor="currentPassword" className="sr-only">Mật khẩu hiện tại</label>
                            <input
                                id="currentPassword"
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Mật khẩu hiện tại"
                                className="w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                                autoComplete="current-password"
                            />
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                {showCurrentPassword ? (
                                    <EyeIcon onClick={() => setShowCurrentPassword(false)} />
                                ) : (
                                    <EyeOffIcon onClick={() => setShowCurrentPassword(true)} />
                                )}
                            </span>
                        </div>
                        <div className="relative">
                            <label htmlFor="newPassword" className="sr-only">Mật khẩu mới</label>
                            <input
                                id="newPassword"
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Mật khẩu mới"
                                className="w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                                autoComplete="new-password"
                            />
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                {showNewPassword ? (
                                    <EyeIcon onClick={() => setShowNewPassword(false)} />
                                ) : (
                                    <EyeOffIcon onClick={() => setShowNewPassword(true)} />
                                )}
                            </span>
                        </div>
                        <div className="relative">
                            <label htmlFor="confirmNewPassword" className="sr-only">Xác nhận mật khẩu mới</label>
                            <input
                                id="confirmNewPassword"
                                type={showConfirmNewPassword ? 'text' : 'password'}
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="Xác nhận mật khẩu mới"
                                className="w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                                autoComplete="new-password"
                            />
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                {showConfirmNewPassword ? (
                                    <EyeIcon onClick={() => setShowConfirmNewPassword(false)} />
                                ) : (
                                    <EyeOffIcon onClick={() => setShowConfirmNewPassword(true)} />
                                )}
                            </span>
                        </div>
                        {passwordError && (
                            <div className="text-red-600 text-sm text-center">{passwordError}</div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-red-700 hover:bg-red-800 text-white font-normal py-2 px-4 rounded-md shadow-md flex items-center justify-center transition-colors disabled:opacity-50" // Changed font-bold to font-normal
                            disabled={isUpdatingPassword}
                        >
                            {isUpdatingPassword ? <LoaderIcon className="mr-2" /> : null}
                            Cập nhật mật khẩu
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};


// --- Thành phần ứng dụng chính ---
export default function App() { 
  // --- Quản lý trạng thái ---
  // Hardcode URL và khóa Anon của Supabase tại đây
  const SUPABASE_URL = 'https://vanqlqcvtwtmwbopejcp.supabase.co'; // Thay thế bằng URL Supabase thực tế của bạn
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhbnFscWN2dHd0bXdib3BlamNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTEwNTksImV4cCI6MjA2MzcyNzA1OX0.Gm7Um5dOGK-4Rhxlo8jbImsIH0B2f66i7bfzAm48nm4'; // THAY THẾ BẰNG KHÓA ANON THỰC TẾ TỪ DỰ ÁN SUPABASE CỦA BẠN!

  const [supabaseClient, setSupabaseClient] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  
  const [keywordSearchTerm, setKeywordSearchTerm] = useState(''); // Từ khóa cho IssuedNumber, Description, Summary
  const [hscodeSearchTerm, setHscodeSearchTerm] = useState('');   // Từ khóa cho HScode
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false); // Điều này bây giờ sẽ chỉ cho biết liệu client đã được khởi tạo hay chưa

  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(0); // Số trang (0-indexed)
  const [itemsPerPage] = useState(30); // Số lượng mục trên mỗi trang mặc định
  const [totalResultsCount, setTotalResultsCount] = useState(0); // Tổng số bản ghi khớp

  // Trạng thái cho popup chi tiết
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Trạng thái đăng nhập và thông tin người dùng
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [currentUser, setCurrentUser] = useState(null); // Lưu thông tin người dùng từ auth.users
  const [showLoginPopup, setShowLoginPopup] = useState(false); 
  const [showAccountPopup, setShowAccountPopup] = useState(false); // Trạng thái cho popup tài khoản
  const [showForgotPasswordPopupGlobal, setShowForgotPasswordPopupGlobal] = useState(false); // Global state for forgot password popup


  // Bộ ánh xạ mặc định
  const defaultMappings = {
    'CCKDHQ': 'Chi cục Kiểm định hải quan',
    'CKDHQ': 'Cục Kiểm định hải quan',
    'TCHQ': 'Tổng cục Hải quan',
    'CHQ': 'Cục Hải quan',
    'D1': 'Đội Kiểm định hải quan 1',
    'D2': 'Đội Kiểm định hải quan 2',
    'D3': 'Đội Kiểm định hải quan 3',
    'D4': 'Đội Kiểm định hải quan 4',
    'D5': 'Đội Kiểm định hải quan 5',
    'KD1': 'Chi cục Kiểm định hải quan 1',
    'KD2': 'Chi cục Kiểm định hải quan 2',
    'KD3': 'Chi cục Kiểm định hải quan 3',
    'KD4': 'Chi cục Kiểm định hải quan 4',
    'KD5': 'Chi cục Kiểm định hải quan 5',
    'KD6': 'Chi cục Kiểm định hải quan 6',
    'KD7': 'Chi cục Kiểm định hải quan khu vực Đông Nam Bộ',
    'KD8': 'Chi cục Kiểm định hải quan khu vực cảng Cái Mép - Thị Vải',
  };
  const [mappings, setMappings] = useState(defaultMappings);


  // --- Tải script động ---
  useEffect(() => {
    // Hàm kiểm tra nếu Supabase đã có sẵn
    if (window.supabase) {
      setIsScriptLoaded(true);
      return;
    }
    
    // Kiểm tra nếu thẻ script đã tồn tại để tránh trùng lặp
    if (document.querySelector('script[src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = true;

    script.onload = () => {
      console.log('Supabase script loaded successfully.');
      setIsScriptLoaded(true);
    };

    script.onerror = () => {
      console.error('Failed to load the Supabase script.');
      setError('Failed to load Supabase library. Please check your network connection.');
    };

    document.body.appendChild(script);

    return () => {
        const existingScript = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"]');
        if (existingScript) {
            document.body.removeChild(existingScript);
        }
    };
  }, []); 


  // --- Khởi tạo kết nối Supabase và kiểm tra phiên người dùng ---
  useEffect(() => {
    setError(null);
    if (isScriptLoaded && typeof window.supabase !== 'undefined') {
      // FIX: Ensure no trailing spaces or empty string check prevents client init
      if (!SUPABASE_URL.trim() || SUPABASE_ANON_KEY === 'YOUR_ACTUAL_SUPABASE_ANON_KEY' || !SUPABASE_ANON_KEY.trim()) { // Updated check
        setError('Supabase URL hoặc Khóa Anon bị thiếu hoặc chưa được cập nhật. Vui lòng đặt chúng trong mã.');
        setIsConfigured(false); // Make sure it's set to false if not configured
        return;
      }

      try {
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        setSupabaseClient(client);
        setIsConfigured(true);

        const checkUserSession = async () => {
            const { data: { session }, error: sessionError } = await client.auth.getSession();

            if (sessionError) {
                console.error("Lỗi khi lấy phiên:", sessionError);
                setIsLoggedIn(false);
                setCurrentUser(null);
                return;
            }

            if (session && session.user) {
                setIsLoggedIn(true);
                setCurrentUser(session.user); // Lưu trữ thông tin người dùng từ Supabase Auth
            } else {
                setIsLoggedIn(false);
                setCurrentUser(null);
            }
        };
        
        checkUserSession();

        // Lắng nghe các thay đổi trạng thái Auth
        const { data: authListener } = client.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_IN') {
                    setCurrentUser(session.user);
                    setIsLoggedIn(true);
                } else if (event === 'SIGNED_OUT') {
                    setIsLoggedIn(false);
                    setCurrentUser(null);
                    setResults([]); // Xóa kết quả khi đăng xuất
                    setTotalResultsCount(0);
                    setCurrentPage(0);
                    setNoResults(false);
                    setError(null);
                }
            }
        );

        // Hàm dọn dẹp listener
        return () => {
            if (authListener && authListener.unsubscribe) {
                authListener.unsubscribe();
            }
        };

      } catch (err) {
        console.error("Lỗi kết nối Supabase:", err);
        setError('Không thể kết nối tới Supabase. Vui lòng kiểm tra URL và Khóa được mã hóa cứng.');
        setIsConfigured(false);
      }
    }
  }, [isScriptLoaded, SUPABASE_URL, SUPABASE_ANON_KEY]); 

  // --- Tải và xử lý file fulltext.txt hoặc sử dụng mặc định ---
  useEffect(() => {
    const fetchMappings = async () => {
        // Luôn khởi tạo với ánh xạ mặc định trước
        setMappings(defaultMappings); 

        try {
            // Sử dụng window.location.origin để tạo URL tuyệt đối
            const response = await fetch(`${window.location.origin}/fulltext.txt`); 
            if (!response.ok) {
                console.warn(`Không tìm thấy fulltext.txt hoặc lỗi tải: ${response.status}. Đang sử dụng các ánh xạ mặc định.`);
                return;
            }
            const text = await response.text();
            const parsedMappings = {};
            text.split('\n').forEach(line => {
                const parts = line.split(';');
                if (parts.length === 2) {
                    parsedMappings[parts[0].trim()] = parts[1].trim();
                }
            });
            // Hợp nhất các ánh xạ đã tải với mặc định, ánh xạ đã tải sẽ ưu tiên nếu trùng khóa
            setMappings(prevMappings => ({ ...prevMappings, ...parsedMappings }));
        } catch (err) {
            // Lỗi này giờ sẽ chỉ xuất hiện nếu fetch thất bại hoàn toàn (ví dụ, lỗi mạng hoặc URL không hợp lệ)
            console.error('Lỗi khi tải hoặc xử lý file fulltext.txt, đang sử dụng ánh xạ mặc định:', err);
        }
    };
    fetchMappings();
  }, []); 

  // --- Hàm ánh xạ giá trị từ key sang chuỗi đầy đủ ---
  const getMappedValue = useCallback((key) => {
      return mappings[key] || key; // Trả về giá trị đã ánh xạ, hoặc key gốc nếu không tìm thấy
  }, [mappings]);


  // --- Hàm định dạng HScode theo độ dài ---
  const formatHScode = (code) => {
    if (!code) return 'N/A';
    const cleanCode = String(code).replace(/\./g, ''); 

    if (cleanCode.length === 4) {
      return `${cleanCode.substring(0, 2)}.${cleanCode.substring(2, 4)}`;
    } else if (cleanCode.length === 6) {
      return `${cleanCode.substring(0, 4)}.${cleanCode.substring(4, 6)}`;
    } else if (cleanCode.length === 8) {
      return `${cleanCode.substring(0, 4)}.${cleanCode.substring(4, 6)}.${cleanCode.substring(6, 8)}`;
    } else if (cleanCode.length === 10) {
      return `${cleanCode.substring(0, 4)}.${cleanCode.substring(4, 6)}.${cleanCode.substring(6, 8)}.${cleanCode.substring(8, 10)}`; 
    }
    return code; 
  };

  // --- Hàm làm nổi bật các từ khóa trong văn bản ---
  const highlightKeywords = (text, combinedSearchTerm) => {
    if (!text || !combinedSearchTerm) return text;

    const keywords = combinedSearchTerm.split(',')
      .map(kw => kw.trim())
      .filter(kw => kw.length > 0);

    if (keywords.length === 0) return text;

    const escapedKeywords = keywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');

    return text.replace(regex, '<mark class="bg-yellow-200 rounded px-1">$&</mark>');
  };

  // --- Hàm giới hạn ký tự cho hiển thị ---
  const truncateText = (text, maxLength) => {
    if (!text) return 'N/A';
    const strText = String(text);
    if (strText.length <= maxLength) return strText;
    return strText.substring(0, maxLength) + '...';
  };

  // --- Chức năng tìm kiếm ---
  const handleSearch = async (e, page = 0) => { 
    if(e) e.preventDefault(); 
    if (!supabaseClient) {
      setError('Client Supabase chưa được khởi tạo.');
      return;
    }

    const trimmedKeywordSearchTerm = keywordSearchTerm.trim();
    const trimmedHscodeSearchTerm = hscodeSearchTerm.trim().replace(/\./g, ''); 

    const parsedKeywords = trimmedKeywordSearchTerm.split(',').map(kw => kw.trim()).filter(kw => kw.length > 0);
    const parsedHsCodes = trimmedHscodeSearchTerm.split(',').map(code => code.trim()).filter(code => code.length > 0);

    if (parsedKeywords.length === 0 && parsedHsCodes.length === 0) {
        setError('Vui lòng nhập ít nhất một từ khóa hoặc mã số HS hợp lệ để tìm kiếm.');
        setResults([]);
        setNoResults(false);
        setTotalResultsCount(0); 
        return;
    }

    setIsLoading(true);
    setError(null);
    setNoResults(false);
    setResults([]);

    let currentItemsPerPage = isLoggedIn ? itemsPerPage : 5;

    const startIndex = page * currentItemsPerPage;
    const endIndex = startIndex + currentItemsPerPage - 1;

    try {
      let queryBuilder = supabaseClient
        .from('documents') 
        .select('id, "IssuedNumber", "IssuedDate", Description, Summary, HScode, "IssuedOffice", "DocType"', { count: 'exact' }); 

      const topLevelFilters = []; 

      // --- Build Keyword Filters ---
      if (parsedKeywords.length > 0) {
        const keywordFieldConditions = []; 
        const fieldsToSearch = ['"Description"', '"Summary"', '"IssuedNumber"'];

        for (const field of fieldsToSearch) {
          const fieldAndConditions = parsedKeywords.map(kw => `${field}.ilike.%${kw}%`);
          // Group these AND conditions for a single field using AND
          keywordFieldConditions.push(`and(${fieldAndConditions.join(',')})`);
        }
        
        // Combine all field-specific AND conditions with OR (e.g., (Desc AND Desc) OR (Summ AND Summ) OR (IssuedNum AND IssuedNum))
        if (keywordFieldConditions.length > 0) {
            topLevelFilters.push(`or(${keywordFieldConditions.join(',')})`);
        }
      }

      // --- Build HS Code Filters ---
      if (parsedHsCodes.length > 0) {
        const hscodeOrConditions = parsedHsCodes.map(code => `"HScode".ilike.%${code}%`);
        if (hscodeOrConditions.length > 0) {
            // This is an OR group for HS codes (e.g., HScode ILIKE '%7219%' OR HScode ILIKE '%7220%')
            topLevelFilters.push(`or(${hscodeOrConditions.join(',')})`);
        }
      }

      // --- Apply Filters to Query Builder ---
      if (topLevelFilters.length === 1) {
        // If only one major filter (either keyword OR hscode), apply it directly using .or()
        queryBuilder = queryBuilder.or(topLevelFilters[0]);
      } else if (topLevelFilters.length > 1) {
        // If both major filters are present, AND them together
        // Use queryBuilder.filter('and', '(filter1,filter2)') for explicit ANDing of multiple complex filters
        queryBuilder = queryBuilder.filter('and', `(${topLevelFilters.join(',')})`);
      }


      const { data, error: queryError, count } = await queryBuilder.range(startIndex, endIndex);

      if (queryError) {
        throw queryError;
      }

      if (data && data.length > 0) {
        setResults(data);
        setTotalResultsCount(count); 
        setNoResults(false);
      } else {
        setNoResults(true);
        setResults([]);
        setTotalResultsCount(0);
      }
      setCurrentPage(page); 

    } catch (err) {
      console.error('Lỗi trong quá trình tìm kiếm:', err);
      setError(`Đã xảy ra lỗi trong quá trình tìm kiếm: ${err.message}. Vui lòng kiểm tra cú pháp truy vấn hoặc chính sách Bảo mật cấp hàng (RLS).`);
      setResults([]);
      setNoResults(false);
      setTotalResultsCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Tính toán tổng số trang
  const totalPages = Math.ceil(totalResultsCount / (isLoggedIn ? itemsPerPage : 5));

  // Xử lý thay đổi trang
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      handleSearch(null, newPage); 
    }
  };

  // Hàm xử lý khi nhấp vào nút "Đăng nhập" để mở popup
  const handleLoginButtonClick = () => {
    setShowLoginPopup(true);
  };

  // Hàm xử lý đăng nhập thành công
  const handleLoginSuccess = async (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user); // Cập nhật thông tin người dùng hiện tại
    setShowLoginPopup(false); 
    // Tải lại kết quả tìm kiếm nếu có để áp dụng quyền truy cập đầy đủ
    if (results.length > 0 || noResults) { 
        handleSearch(null, 0); 
    }
  };

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    if (supabaseClient) {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.error("Lỗi đăng xuất:", error.message);
            setError("Lỗi khi đăng xuất.");
        } else {
            setIsLoggedIn(false);
            setCurrentUser(null); // Xóa thông tin người dùng
            setResults([]); // Xóa kết quả sau khi đăng xuất
            setTotalResultsCount(0);
            setCurrentPage(0);
            setNoResults(false);
            setError(null);
        }
    }
  };

  // Hàm xử lý khi nhấp vào một bản ghi để hiển thị chi tiết
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowDetailPopup(true);
  };

  // Hàm đóng popup chi tiết
  const handleCloseDetailPopup = () => {
    setShowDetailPopup(false);
    setSelectedItem(null);
  };

  // Hàm đóng popup đăng nhập
  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  // Hàm xử lý mở popup tài khoản
  const handleAccountClick = () => {
    setShowAccountPopup(true);
  };

  // Hàm đóng popup tài khoản
  const handleCloseAccountPopup = () => {
    setShowAccountPopup(false);
  };

  // Hàm xử lý khi thông tin người dùng được cập nhật từ AccountPopup
  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser); // Cập nhật trạng thái currentUser
  };

  // Hàm xử lý để mở Forgot Password Popup từ Login Popup
  const handleForgotPasswordClickFromLogin = () => {
    setShowLoginPopup(false); // Close login popup first
    setShowForgotPasswordPopupGlobal(true); // Open the global forgot password popup
  };

  // Hàm đóng Forgot Password Popup (global)
  const handleCloseForgotPasswordPopupGlobal = () => {
    setShowForgotPasswordPopupGlobal(false);
  };

  // --- Hiển thị UI ---
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      {/* Styles are now in src/index.css, no need for <style> tag here */}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
        
        {/* Thanh công cụ/Navbar ở trên cùng */}
        <nav className="flex justify-end items-center py-3 px-4 bg-white rounded-xl shadow-sm mb-8"> {/* Bỏ border */}
            <div>
                {isLoggedIn ? (
                    <>
                        <a 
                            href="#" 
                            onClick={handleAccountClick} 
                            className="text-red-700 hover:text-red-900 text-sm py-2 px-3 transition-colors hover:underline mr-4 font-normal" // Changed font-bold to font-normal
                        >
                            Tài khoản ({currentUser?.user_metadata?.display_name || currentUser?.email || 'Người dùng'})
                        </a>
                        <a 
                            href="#" 
                            onClick={handleLogout} 
                            className="text-red-700 hover:text-red-900 text-sm py-2 px-3 transition-colors hover:underline font-normal" // Changed font-bold to font-normal
                        >
                            Đăng xuất
                        </a>
                    </>
                ) : (
                    <a
                        href="#"
                        onClick={handleLoginButtonClick} 
                        className="text-red-700 hover:text-red-900 text-sm py-2 px-3 transition-colors hover:underline font-normal" // Changed font-bold to font-normal
                    >
                        Đăng nhập
                    </a>
                )}
            </div>
        </nav>

        <header className="text-center mb-8"> 
          <h1 className="text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight">Tra cứu mã số HS</h1> {/* Changed font-bold to font-normal */}
          <p className="mt-2 text-slate-600">Sử dụng các hộp tìm kiếm bên dưới để tra cứu dữ liệu.</p>
        </header>

        {/* Kết xuất có điều kiện cho trạng thái/lỗi kết nối */}
        {!isConfigured && !isLoading && error && (
             <div className="flex flex-col items-center justify-center text-center p-4 mb-6 bg-red-50 text-red-700 rounded-lg">
                <AlertTriangleIcon />
                <p className="mt-2 font-normal">Đã xảy ra lỗi</p> {/* Changed font-semibold to font-normal */}
                <p className="text-sm">{error}</p>
            </div>
        )}
        {!isConfigured && !error && !isLoading && (
            <div className="flex items-center justify-center text-center p-4 mb-6 bg-blue-50 text-blue-700 rounded-lg">
                <LoaderIcon />
                <p className="ml-3 font-normal">Đang kết nối tới cơ sở dữ liệu, vui lòng chờ trong chốc lát...</p> {/* Changed font-bold to font-normal */}
            </div>
        )}

        {isConfigured && (
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <form onSubmit={(e) => handleSearch(e, 0)}> 
                    <div className="mb-4"> {/* Hộp tìm kiếm Từ khóa */}
                        <label htmlFor="keywordSearch" className="block text-sm font-normal text-slate-700 mb-1">Tìm kiếm theo từ khóa:</label> {/* Changed font-medium to font-normal */}
                        <input
                            id="keywordSearch"
                            type="text"
                            value={keywordSearchTerm}
                            onChange={(e) => setKeywordSearchTerm(e.target.value)}
                            placeholder="Nhập từ khóa, các từ khóa phân cách nhau bởi dấu phảy"
                            className="w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-4"> {/* Hộp tìm kiếm Mã số HS */}
                        <label htmlFor="hscodeSearch" className="block text-sm font-normal text-slate-700 mb-1">Tìm kiếm theo mã số HS:</label> {/* Changed font-medium to font-normal */}
                        <input
                            id="hscodeSearch"
                            type="text"
                            value={hscodeSearchTerm}
                            onChange={(e) => setHscodeSearchTerm(e.target.value)}
                            placeholder="Mã số HS, các mã số cần tìm phân cách nhau bởi dấu phảy"
                            className="w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white font-normal py-3 px-4 rounded-md shadow-md flex items-center justify-center transition-colors disabled:opacity-50" disabled={isLoading}> {/* Changed font-bold to font-normal */}
                        {isLoading ? <LoaderIcon className="mr-2"/> : <SearchIcon className="mr-2" />}
                        Tìm kiếm
                    </button>
                </form>

                <div className="mt-6 min-h-[200px]">
                  {error && (
                     <div className="flex flex-col items-center justify-center text-center p-6 bg-red-50 text-red-700 rounded-lg">
                        <AlertTriangleIcon />
                        <p className="mt-2 font-normal">Đã xảy ra lỗi</p> {/* Changed font-semibold to font-normal */}
                        <p className="text-sm">{error}</p>
                    </div>
                  )}

                  {noResults && ( <div className="text-center p-6 text-slate-500"> <p className="font-normal">Không tìm thấy kết quả nào cho tìm kiếm của bạn.</p> </div> )} {/* Changed font-normal */}

                  {results.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-normal text-slate-800 border-b pb-2">
                            Kết quả tìm kiếm ({isLoggedIn ? 'Đầy đủ' : 'Demo - giới hạn 5 bản ghi'})
                        </h3> {/* Changed font-semibold to font-normal */}
                        <ul className="divide-y divide-slate-200">
                           {results.slice(0, isLoggedIn ? results.length : 5).map((item, index) => ( 
                                <li
                                    key={item.id || index}
                                    onClick={() => handleItemClick(item)}
                                    className="p-4 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                                >
                                    {/* HScode với màu Darkred */}
                                    <p className="font-mono text-lg text-darkred-700 font-normal"> {/* Changed font-semibold to font-normal */}
                                        <strong>Mã số HS: </strong>
                                        <span dangerouslySetInnerHTML={{ __html: highlightKeywords(truncateText(item.HScode, 200), `${keywordSearchTerm},${hscodeSearchTerm}`) }}></span>
                                    </p>
                                    
                                    {/* Số văn bản */}
                                    <p className="text-slate-700 mt-1">
                                        <strong>Số văn bản:</strong> <span dangerouslySetInnerHTML={{ __html: highlightKeywords(truncateText(item.IssuedNumber, 200), `${keywordSearchTerm},${hscodeSearchTerm}`) }}></span>
                                    </p>
                                    {/* Ngày ban hành */}
                                    <p className="text-sm text-slate-600"><strong>Ngày ban hành:</strong> {item.IssuedDate || 'N/A'}</p>
                                    <p className="text-slate-700 mt-1">
                                        <strong>Mô tả hàng hóa:</strong> <span dangerouslySetInnerHTML={{ __html: highlightKeywords(truncateText(item.Description, 200), `${keywordSearchTerm},${hscodeSearchTerm}`) }}></span>
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        <strong>Tóm tắt thông tin:</strong> <span dangerouslySetInnerHTML={{ __html: highlightKeywords(truncateText(item.Summary, 200), `${keywordSearchTerm},${hscodeSearchTerm}`) }}></span>
                                    </p>
                                    {item.IssuedOffice && (
                                        <p className="text-sm text-slate-600">
                                            <strong>Đơn vị ban hành:</strong> {getMappedValue(item.IssuedOffice)}
                                        </p>
                                    )}
                                    {item.DocType && (
                                        <p className="text-sm text-slate-600">
                                            <strong>Loại văn bản:</strong> {getMappedValue(item.DocType)}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                        
                        {!isLoggedIn && totalResultsCount > 5 && ( 
                            <div className="text-center p-4 bg-blue-50 text-blue-800 rounded-md mt-4">
                                <p className="font-normal">Hãy đăng nhập để xem đầy đủ kết quả tra cứu ({totalResultsCount} bản ghi).</p> {/* Changed font-semibold to font-normal */}
                                <a
                                    href="#"
                                    onClick={handleLoginButtonClick} 
                                    className="mt-3 text-red-700 hover:text-red-900 font-normal py-2 px-5 rounded-md transition-colors hover:underline" // Changed font-bold to font-normal
                                >
                                    Đăng nhập
                                </a>
                            </div>
                        )}

                        {totalPages > 1 && isLoggedIn && ( // Chỉ hiển thị phân trang nếu đã đăng nhập
                            <div className="flex justify-center items-center gap-2 mt-6">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0 || isLoading}
                                    className="bg-red-700 hover:bg-red-800 text-white py-1 px-2 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-normal" // Changed font-bold to font-normal
                                >
                                    Trang trước
                                </button>
                                <span className="text-slate-700 font-normal text-sm">
                                    Trang {currentPage + 1} / {totalPages}
                                </span> {/* Changed font-semibold to font-normal */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1 || isLoading}
                                    className="bg-red-700 hover:bg-red-800 text-white py-1 px-2 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-normal" // Changed font-bold to font-normal
                                >
                                    Trang sau
                                </button>
                            </div>
                        )}
                    </div>
                  )}
                </div>
            </div>
        )}
      </div>
       <footer className="text-center py-4 mt-8">
            <p className="text-sm text-slate-500">Được tạo bằng Gemini 2.5 Flash</p>
        </footer>

        {/* Render Popup chi tiết nếu showDetailPopup là true */}
        {showDetailPopup && (
            <DetailPopup 
                item={selectedItem} 
                onClose={handleCloseDetailPopup} 
                formatHScode={formatHScode}
                highlightKeywords={highlightKeywords}
                keywordSearchTerm={keywordSearchTerm}
                hscodeSearchTerm={hscodeSearchTerm}
                getMappedValue={getMappedValue}
            />
        )}

        {/* Render Login Popup nếu showLoginPopup là true */}
        {showLoginPopup && (
            <LoginPopup 
                onClose={handleCloseLoginPopup} 
                onLoginSuccess={handleLoginSuccess}
                supabaseClient={supabaseClient}
                onForgotPasswordClick={handleForgotPasswordClickFromLogin} // Pass the new handler
            />
        )}

        {/* Render Account Popup nếu showAccountPopup là true */}
        {showAccountPopup && currentUser && (
            <AccountPopup
                onClose={handleCloseAccountPopup}
                currentUser={currentUser}
                supabaseClient={supabaseClient}
                onUpdateUser={handleUpdateUser} // Truyền hàm để cập nhật lại currentUser trong App.js
            />
        )}

        {/* Render Forgot Password Popup nếu showForgotPasswordPopupGlobal là true */}
        {showForgotPasswordPopupGlobal && (
            <ForgotPasswordPopup
                onClose={handleCloseForgotPasswordPopupGlobal}
                supabaseClient={supabaseClient}
            />
        )}
    </div>
  );
}
